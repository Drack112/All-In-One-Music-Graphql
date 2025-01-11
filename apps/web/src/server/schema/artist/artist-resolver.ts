import { Arg, Int, Query, Resolver } from 'type-graphql'
import Artist from './artist'
import { CacheControl } from '../cache-control'
import { Song } from '../song/song'
import { lastFM } from '@/server/modules/lastfm'
import { audioDB } from '@/server/modules/audiodb/audiodb'

@Resolver(Artist)
export class ArtistResolver {
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
          : similarArtistName
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
}
