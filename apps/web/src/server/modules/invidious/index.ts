import type { AxiosResponse } from 'axios'
import Axios, { AxiosError } from 'axios'

import { logger } from '@/server/logger'

import type {
  GetMixesResponse,
  GetPlaylistById,
  GetVideoById,
  GetVideoSearch,
} from './types'
import { cache } from '@/server/cache'

const getEndpoint = (baseUrl: string, method: string) =>
  `${baseUrl}/api/v1/${method}`

export const invidiousUrls =
  process.env.NEXT_PUBLIC_INVIDIOUS_URLS?.split(',') ?? []

type InvidiousMethods =
  | `videos/${string}`
  | `search?q=${string}`
  | `mixes/RD${string}`
  | `playlists/${string}`

const invidious = async <T>(method: InvidiousMethods) => {
  let response = {} as AxiosResponse<T>

  for (const invidiousUrl of invidiousUrls) {
    const cacheKey = `rateLimit:${invidiousUrl}`
    if (cache.has(cacheKey)) continue

    try {
      response = await Axios.get<T>(getEndpoint(invidiousUrl, method), {
        timeout: 15000,
      })

      if (response.headers['content-type'] === 'text/html') {
        throw new Error('Bad Response')
      }

      if (response.status === 200) break
    } catch (e) {
      if (e instanceof AxiosError) {
        logger.info(
          `Invidious error: ${invidiousUrl} - ${JSON.stringify(e.response?.data)}`
        )
        if (
          e.response?.data &&
          ['Too Many Requests', 'Gateway', 'Bad Response', 'API disabled'].some(
            (error) => String(e.response?.data).includes(error)
          )
        ) {
          cache.set(cacheKey, 'true')

          continue
        }

        if (
          e.response?.data &&
          typeof e.response?.data === 'object' &&
          'error' in e.response.data &&
          String(e.response?.data.error).includes('Could not create mix')
        ) {
          break
        }
        continue
      }
      logger.info(`Unexpected Invidious error: ${invidiousUrl} - ${String(e)}`)
      continue
    }
  }

  return response
}

invidious.getVideoInfo = (args: { videoId: string }) =>
  invidious<GetVideoById>(`videos/${args.videoId}`)

invidious.getVideos = async (args: { query: string }) => {
  const response = await invidious<GetVideoSearch>(
    `search?q=${args.query}&sortBy=relevance&page=1`
  )
  return { data: response.data.filter((video) => video.type === 'video') }
}

invidious.getPlaylist = (args: { playlistId: string }) =>
  invidious<GetPlaylistById>(`playlists/${args.playlistId}`)

invidious.getMix = (args: { videoId: string }) =>
  invidious<GetMixesResponse>(`mixes/RD${args.videoId}`)

export { invidious }
