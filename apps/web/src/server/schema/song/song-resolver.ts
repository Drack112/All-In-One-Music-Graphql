import { Arg, Query, Resolver } from 'type-graphql'
import { Song, SongLyrics, SongVideo } from './song'
import { CacheControl } from '../cache-control'
import { invidious } from '@/server/modules/invidious'
import { isEmpty } from 'lodash'
import { getLyrics } from '@/server/modules/lyrics'

@Resolver(Song)
export class SongResolver {
  @Query(() => [SongVideo])
  @CacheControl({ maxAge: 60 * 60 * 24 })
  async getVideoInfo(@Arg('query') query: string): Promise<SongVideo[]> {
    const { data } = await invidious.getVideos({ query })
    const video = data.map((video) => ({
      title: video.title,
      artist: video.author,
      videoId: video.videoId,
      videoUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
      thumbnailUrl:
        video.videoThumbnails.find((vt) => vt.quality === 'default')?.url ?? '',
    }))

    if (isEmpty(video)) {
      throw new Error(`Video not found for query: ${query}`)
    }

    return video.slice(0, 5)
  }

  @Query(() => SongLyrics)
  @CacheControl({ maxAge: 60 * 60 * 24 })
  async getLyrics(
    @Arg('artist') artist: string,
    @Arg('song') song: string
  ): Promise<SongLyrics> {
    const lyrics = await getLyrics({
      artist,
      title: song,
    })

    if (isEmpty(lyrics)) {
      return {
        artist,
        title: song,
        lyrics: '',
      }
    }

    return {
      artist,
      title: song,
      lyrics,
    }
  }
}
