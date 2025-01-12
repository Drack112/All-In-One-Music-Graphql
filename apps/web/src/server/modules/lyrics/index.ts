// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line

import { logger } from '@/server/logger'
import type { GetLyricsOptions } from './types'
import lyrics from '@faouzkk/lyrics-finder'

const getLyrics = async (args: Pick<GetLyricsOptions, 'artist' | 'title'>) => {
  const [title, artist] = `${args.title}▲${args.artist}`
    .toLowerCase()
    .replace(/ *\([^)]*\) */g, '')
    .replace(/ *\[[^\]]*]/, '')
    .replace(/\b(feat\.|ft\.)\b/g, '')
    .replace(/\s+/g, ' ')
    .replace('<3', '')
    .trim()
    .split('▲')

  logger.info(`Fetching lyrics for ${title} by ${artist}`)

  const response = await lyrics(`${artist} ${title}`)
  console.log(response)
  return response
}

export { getLyrics }
