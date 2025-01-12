import { topSongsByArtistQuery } from '@/api'
import { SongList } from '@/components/song-list'
import { sortablePropertiesMapping } from '@/constants'
import {
  ArtistSortableProperties,
  useLocalSettings,
} from '@/store/use-local-settings'
import { useQuery } from '@tanstack/react-query'
import { orderBy } from 'lodash'
import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'

interface ArtistSongsProps {
  artist: string
}

export const ArtistSongs = (props: ArtistSongsProps) => {
  const { artist } = props

  const { data: topsongsByArtist, isPending } = useQuery({
    queryKey: ['topsongsByArtist', artist],
    queryFn: () => topSongsByArtistQuery({ artist }),
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const { sortedPlaylists } = useLocalSettings(
    useShallow((state) => ({
      sortedPlaylists: state.sortedPlaylists,
    }))
  )
  const sortingSettings = sortedPlaylists.find(
    (playlist) => playlist.identifier === artist
  )

  const sortBySetting = sortingSettings?.sortBy || 'default'

  const sortedSongs = useMemo(() => {
    if (sortBySetting === 'scrobbles') {
      return orderBy(
        topsongsByArtist?.topSongsByArtist,
        (song) =>
          song.playcount ? Number(song.playcount) : Number.MIN_SAFE_INTEGER,
        [sortingSettings?.direction || 'desc']
      )
    }
    return orderBy(
      topsongsByArtist?.topSongsByArtist,
      sortablePropertiesMapping[sortBySetting as ArtistSortableProperties],
      [sortingSettings?.direction || 'desc']
    )
  }, [
    sortingSettings?.direction,
    topsongsByArtist?.topSongsByArtist,
    sortBySetting,
  ])

  return (
    <SongList identifier={artist} songs={sortedSongs} isLoading={isPending} />
  )
}
