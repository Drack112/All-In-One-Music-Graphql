import type { AxiosResponse } from 'axios'
import Axios, { AxiosError } from 'axios'

import { logger } from '@/server/logger'
import { cache } from '@/server/cache'

import type {
  GetMixesResponse,
  GetPlaylistById,
  GetVideoById,
  GetVideoSearch,
} from './types'

/**
 * CONFIG — tuned for Vercel Serverless
 */
const REQUEST_TIMEOUT = 3000 // 3s per request
const MAX_ATTEMPTS = 3 // max instances per call

/**
 * Utils
 */
const getEndpoint = (baseUrl: string, method: string) =>
  `${baseUrl}/api/v1/${method}`

const shuffle = <T>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5)

/**
 * Invidious instances
 */
export const invidiousUrls: string[] =
  process.env.NEXT_PUBLIC_INVIDIOUS_URLS?.split(',').filter(Boolean) ?? []

type InvidiousMethods =
  | `videos/${string}`
  | `search?q=${string}`
  | `mixes/RD${string}`
  | `playlists/${string}`

/**
 * Core request function
 */
const invidious = async <T>(
  method: InvidiousMethods
): Promise<AxiosResponse<T>> => {
  if (!invidiousUrls.length) {
    throw new Error('No Invidious URLs configured')
  }

  const urls = shuffle(invidiousUrls)
  let attempts = 0
  let lastError: unknown = null

  for (const invidiousUrl of urls) {
    if (attempts >= MAX_ATTEMPTS) break
    attempts++

    const cacheKey = `rateLimit:${invidiousUrl}`
    if (cache.has(cacheKey)) continue

    try {
      const response = await Axios.get<T>(
        getEndpoint(invidiousUrl, method),
        { timeout: REQUEST_TIMEOUT }
      )

      const contentType = String(response.headers['content-type'] ?? '')

      if (
        response.status === 200 &&
        !contentType.includes('text/html')
      ) {
        return response
      }

      throw new Error('Bad response')
    } catch (e) {
      lastError = e

      if (e instanceof AxiosError) {
        logger.info(`Invidious error: ${invidiousUrl}`)

        // Mark instance as bad for this runtime
        cache.set(cacheKey, 'true')
        continue
      }

      logger.info(
        `Unexpected Invidious error: ${invidiousUrl} - ${String(e)}`
      )
      cache.set(cacheKey, 'true')
      continue
    }
  }

  throw new Error(
    `All Invidious instances failed after ${attempts} attempts`
  )
}

/**
 * Public API
 */
invidious.getVideoInfo = (args: { videoId: string }) =>
  invidious<GetVideoById>(`videos/${args.videoId}`)

invidious.getVideos = async (args: { query: string }) => {
  const response = await invidious<GetVideoSearch>(
    `search?q=${encodeURIComponent(args.query)}&sortBy=relevance&page=1`
  )

  return {
    data: response.data.filter((video) => video.type === 'video'),
  }
}

invidious.getPlaylist = (args: { playlistId: string }) =>
  invidious<GetPlaylistById>(`playlists/${args.playlistId}`)

invidious.getMix = (args: { videoId: string }) =>
  invidious<GetMixesResponse>(`mixes/RD${args.videoId}`)

export { invidious }
