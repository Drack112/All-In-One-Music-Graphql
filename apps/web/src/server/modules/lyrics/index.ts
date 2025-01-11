// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line

import { Client } from 'genius-lyrics'
import { logger } from '@/server/logger'

import type { GetLyricsOptions } from './types'

const api = new Client(process.env.GENIUS_ACCESS_TOKEN!)

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

  const response = await api.songs.search(`${title} ${artist}`)
  return await response[0].lyrics()
}

export { getLyrics }
