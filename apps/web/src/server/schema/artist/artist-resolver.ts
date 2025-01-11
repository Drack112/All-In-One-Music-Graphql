import { Arg, Int, Query, Resolver } from 'type-graphql'
import Artist from './artist'
import { CacheControl } from '../cache-control'
import { Song } from '../song/song'
import { lastFM } from '@/server/modules/lastfm'

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
}
