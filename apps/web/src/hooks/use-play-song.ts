import { head, isNil } from 'lodash'
import { useCallback } from 'react'

import { getVideoInfoQuery, queryClient } from '@/api'
import { queryKeys } from '@/constants'
import { useLocalSettings } from '@/store/use-local-settings'
import { usePlayerState } from '@/store/use-player'
import type { PlayableSong } from '@/types'
import { getMainArtist } from '@/utils/song-titles.helper'

interface UsePlaySongOptions {
  songs: PlayableSong[]
  songsIdentifier: string
}

export const usePlaySong = (options: UsePlaySongOptions) => {
  const { songs, songsIdentifier: identifier } = options

  const { isShuffled } = useLocalSettings((state) => ({
    toggleShuffledPlaylist: state.toggleShuffledPlaylist,
    isShuffled: state.shuffledPlaylists.includes(identifier ?? ''),
  }))

  const { setShuffle, setQueueIdentifier } = usePlayerState((state) => ({
    setQueueIdentifier: state.setQueueIdentifier,
    setShuffle: state.setShuffle,
  }))

  const { setIsPlaying, setCurrentSong, setQueue } = usePlayerState()

  const onPlaySong = useCallback(
    async (song: PlayableSong) => {
      const { artist, title, songUrl } = song

      if (identifier) {
        if (!isNil(isShuffled)) {
          setShuffle(isShuffled)
        }
        setQueueIdentifier(identifier ?? '')
      }

      if (!songUrl) {
        const videoSearchQuery = `${getMainArtist(artist)} - ${title}`

        const data = await queryClient.fetchQuery({
          queryKey: queryKeys.videoInfo(videoSearchQuery),
          queryFn: () =>
            getVideoInfoQuery({
              query: videoSearchQuery,
            }),
          staleTime: Infinity,
          gcTime: Infinity,
        })

        const urls = data?.getVideoInfo.map((video) => video.videoUrl)

        setCurrentSong({
          artist,
          title,
          urls,
          videoThumbnailUrl: head(data.getVideoInfo)?.thumbnailUrl,
          albumCoverUrl: song.albumCoverUrl || undefined,
        }).catch((err) => console.error('Error setting current song', err))
      } else {
        setCurrentSong({
          artist,
          title,
          urls: [songUrl],
        }).catch((err) => console.error('Error setting current song', err))
      }

      if (identifier) {
        setQueue(
          songs.map((song) => ({
            artist: song.artist,
            title: song.title,
            urls: song.songUrl ? [song.songUrl] : undefined,
          })) || []
        )
      }

      setIsPlaying(true)
    },
    [
      identifier,
      isShuffled,
      setCurrentSong,
      setIsPlaying,
      setQueue,
      setQueueIdentifier,
      setShuffle,
      songs,
    ]
  )

  return {
    onPlaySong,
  }
}
