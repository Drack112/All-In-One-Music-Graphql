import { Arg, Int, Query, Resolver } from 'type-graphql'
import Artist from './entities/artist'
import { CacheControl } from '../../decorators/cache-control'
import { Song } from '../song/entities/song'
import { lastFM } from '@/server/modules/lastfm'
import { audioDB } from '@/server/modules/audiodb'
import { compact, find, isEmpty, map, orderBy, toLower } from 'lodash'
import { Album } from '../album/entities/album'
import { getCoverImage } from '@/utils/get-cover-image'
import { logger } from '@/server/logger'
import { cache } from '@/server/cache'
import gis from 'async-g-i-s'

async function getImage(query: string, index = 0) {
  const cacheKey = `${query}-${index}`
  const cachedResult = cache.get(cacheKey)

  if (cachedResult) {
    return cachedResult
  }

  const results = await gis(query, { query: { safe: 'on' } })
  logger.info(`Found ${results.length} results for ${query}.`)

  const filteredResults = results.filter(
    (result) =>
      (result.url.startsWith('https') || result.url.startsWith('http')) &&
      !result.url.includes('www') &&
      /\.(jpg|jpeg|png)$/i.test(result.url)
  )
  const result = filteredResults[Math.min(index, filteredResults.length - 1)]

  if (result?.url) {
    const cleanUrl = result.url.replace(/&w=\d+&q=\d+/g, '')
    cache.set(cacheKey, cleanUrl)
    return cleanUrl
  }

  return undefined
}

@Resolver(Artist)
export class ArtistResolver {
  @Query(() => Artist)
  @CacheControl({ maxAge: 60 * 60 * 24 * 7 })
  async artist(
    @Arg('name') name: string
  ): Promise<Partial<Artist> | undefined> {
    const getArtist = async (): Promise<Partial<Artist> | undefined> => {
      const [getArtistResponse, getFallbackArtistResponse] = await Promise.all([
        audioDB.getArtist({ artist: name }),
        lastFM.getArtist({ artist: name }),
      ])

      const artist = getArtistResponse.data?.artists?.[0]

      const fallbackArtist = getFallbackArtistResponse.data?.artist

      if (artist) {
        return {
          name: artist.strArtist,
          formedYear: artist.intFormedYear?.toString(),
          image: artist.strArtistThumb,
          bannerImage: artist.strArtistFanart,
          logo: artist.strArtistLogo,
          style: artist.strStyle,
          genre: artist.strGenre,
          website: artist.strWebsite,
          facebook: artist.strFacebook,
          twitter: artist.strTwitter,
          biography: fallbackArtist.bio.summary || artist.strBiographyEN,
          memberQuantity: Number(artist.intMembers),
          location: artist.strCountry,
          disbanded: artist.strDisbanded
            ? Boolean(artist.strDisbanded)
            : undefined,
          disbandedYear: artist.intDiedYear?.toString(),
        }
      }

      if (!fallbackArtist) {
        return undefined
      }

      const bannerImage = await getImage(
        `${fallbackArtist.name} artist`,
        Math.floor(Math.random() * 3)
      )

      return {
        name: fallbackArtist.name,
        biography: fallbackArtist.bio.summary,
        // genre: fallbackArtist.tags.tag?.map((tag) => tag.name).join(', '),
        genre: '',
        bannerImage: bannerImage,
      }
    }

    const artist = await getArtist()

    if (!artist) {
      throw new Error('Artist not found')
    }

    return artist
  }

  @Query(() => [Song])
  @CacheControl({ maxAge: 60 * 60 * 24 * 7 })
  async topSongsByArtist(
    @Arg('artist') artist: string,
    @Arg('limit', () => Int, { defaultValue: 30 }) limit: number,
    @Arg('page', () => Int, { nullable: true }) page?: number
  ): Promise<Pick<Song, 'title' | 'artist' | 'playcount'>[]> {
    const { data } = await lastFM.getArtistSongs({ artist, limit, page })

    const tracks = data.toptracks?.track
    if (!tracks) {
      throw new Error(`Tracks not found for artist ${artist}`)
    }

    return tracks?.map((track) => ({
      title: track.name,
      artist: track.artist.name,
      playcount: track.playcount,
    }))
  }

  @Query(() => [Artist])
  @CacheControl({ maxAge: 60 * 60 * 24 * 7 })
  async similarArtists(
    @Arg('artist') artist: string,
    @Arg('limit', () => Int, { defaultValue: 8 }) limit: number,
    @Arg('onlyNames', { defaultValue: true }) onlyNames?: boolean
  ): Promise<Partial<Artist>[]> {
    const getSimilarArtistsResponse = await lastFM.getSimilarArtists({
      artist,
      limit,
    })

    const similarArtistsBase =
      getSimilarArtistsResponse.data?.similarartists?.artist || []

    const similarArtistsNames = similarArtistsBase.map((artist) => ({
      name: artist.name,
    }))

    if (onlyNames) {
      return similarArtistsNames
    }

    const similarArtist = await Promise.all(
      similarArtistsNames.map(async (similarArtistName) => {
        const getArtistResponse = await audioDB.getArtist({
          artist: similarArtistName.name,
        })

        const similarArtist = getArtistResponse.data.artists?.[0]

        const bannerImage = await getImage(
          `${similarArtistName.name} artist`,
          Math.floor(Math.random() * 3)
        )

        return similarArtist
          ? {
              name: similarArtist.strArtist,
              formedYear: similarArtist.intFormedYear?.toString(),
              image: similarArtist.strArtistThumb,
              bannerImage: similarArtist.strArtistFanart,
              logo: similarArtist.strArtistLogo,
              style: similarArtist.strStyle,
              genre: similarArtist.strGenre,
              website: similarArtist.strWebsite,
              facebook: similarArtist.strFacebook,
              twitter: similarArtist.strTwitter,
              biography: similarArtist.strBiographyEN,
              memberQuantity: Number(similarArtist.intMembers),
              location: similarArtist.strCountry,
              disbanded: similarArtist.strDisbanded
                ? Boolean(similarArtist.strDisbanded)
                : undefined,
              disbandedYear: similarArtist.intDiedYear?.toString(),
            }
          : {
              name: similarArtistName.name,
              bannerImage,
              image: bannerImage,
            }
      })
    )

    return similarArtist
  }

  @Query(() => [String])
  async searchArtists(
    @Arg('artist') artist: string,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number
  ): Promise<string[]> {
    const searchArtistResponse = await lastFM.searchArtist({ artist, limit })
    const artists = searchArtistResponse.data.results?.artistmatches?.artist

    return artists?.map((artist) => artist.name) || []
  }

  @Query(() => [Album], { nullable: true })
  @CacheControl({ maxAge: 60 * 60 * 24 * 7 })
  async getAlbums(
    @Arg('artist') artist: string,
    @Arg('limit', () => Int, { nullable: true, defaultValue: 10 })
    limit: number,
    @Arg('page', () => Int, { nullable: true }) page?: number
  ): Promise<Album[]> {
    const getTopAlbums = await lastFM.getTopAlbums({ artist, limit, page })

    const fallbackAlbums = getTopAlbums.data.topalbums?.album

    if (!fallbackAlbums) {
      return []
    }

    const albums = compact(
      map(fallbackAlbums, (fallbackAlbum) => {
        try {
          const albumArtistName = fallbackAlbum?.artist.name

          if (
            isEmpty(fallbackAlbum.name) ||
            fallbackAlbum.name === '(null)' ||
            fallbackAlbum.name === 'undefined'
          ) {
            return undefined
          }

          const coverImage = getCoverImage(fallbackAlbum?.image)

          return {
            artist: albumArtistName,
            coverImage,
            description: '', // No description available from lastFM
            name: fallbackAlbum.name,
            genre: '', // No genre available from lastFM
            year: '', // No year available from lastFM
            albumId: '', // No albumId available from lastFM
          } satisfies Album
        } catch {
          return undefined
        }
      })
    )

    const albumsSorted = orderBy(
      albums,
      [
        (item) => (item.year ? Number(item.year) : 0),
        (item) => (item.coverImage?.length ? 1 : 2),
      ],
      ['desc', 'asc']
    )
    return albumsSorted
  }
}
