// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line

import { logger } from '@/server/logger'

import type { GetLyricsOptions } from './types'

import lyricsFinder from '@jeve/lyrics-finder'

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

  return await lyricsFinder.LyricsFinder(`${title} ${artist}`)
}

export { getLyrics }
