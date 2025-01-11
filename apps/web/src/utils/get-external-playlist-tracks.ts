import spotifyFetch from 'spotify-url-info'
import { ytGetId } from './get-yt-url-id'
import { invidious } from '@/server/modules/invidious'
import { formatYoutubeTitle } from './format-youtube-title'
import { map } from 'lodash'
import { soundcloud } from '@/server/modules/soundcloud'

const spotifyRequest = spotifyFetch(fetch)

export const getExternalPlaylistTracks = async (
  url: string,
  source: 'spotify' | 'youtube' | 'soundcloud'
): Promise<{ title: string; artist: string; url?: string }[]> => {
  if (source === 'spotify') {
    return (await spotifyRequest.getTracks(url)).map(
      (track: { name: string; artist: string }) => ({
        title: track.name,
        artist: track.artist,
      })
    )
  }

  if (source === 'youtube') {
    const ytId = ytGetId(url)
    if (!ytId) return []

    if (ytId.type === 'video') {
      const videoInfo = await invidious.getVideoInfo({ videoId: ytId.id })

      return [
        {
          ...formatYoutubeTitle(videoInfo.data.title, videoInfo.data.author),
          url,
        },
      ]
    }

    return map(
      (await invidious.getPlaylist({ playlistId: ytId.id })).data.videos,
      (video) => formatYoutubeTitle(video.title, video.author)
    )
  }

  if (source === 'soundcloud') {
    const data = await soundcloud.getTrack(url)

    return [
      {
        ...formatYoutubeTitle(data.title, data.user.username),
        url,
      },
    ]
  }

  return []
}
