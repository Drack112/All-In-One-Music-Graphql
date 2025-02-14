import { useQuery } from '@tanstack/react-query'
import type { ClientError } from 'graphql-request'
import { orderBy } from 'lodash'
import type { NextPage } from 'next'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

import { playlistQuery } from '@/api'
import { useLayoutState } from '@/store/use-layout-state'
import { useLocalSettings } from '@/store/use-local-settings'
import { sortByLexoRankAsc } from '@/utils/lexorank'
import { useModalStore } from '@/store/use-modal'
import { playlistType } from '@/constants'
import { ImportPlaylistModal } from '@/components/modals/playlist/import'
import { Toast } from '@/components/toast'
import { getError } from '@/utils/get-error'
import { SongList } from '@/components/song-list'
import { TheaterMode } from '@/components/theater-mode'
import { Seo } from '@/components/seo'
import { VideoPlayerPortalContainer } from '@/components/video-player'
import { ArtistHeader } from '@/components/artist/header'

const PlaylistPage: NextPage = () => {
  const params = useParams<{ playlistId: string }>()

  const session = useSession()

  const playlist = useQuery({
    queryKey: ['userPlaylist', params?.playlistId],
    queryFn: () => playlistQuery({ playlistId: params?.playlistId ?? '' }),
    staleTime: Infinity,
    enabled: !!params?.playlistId,
  })

  // need a separate state for instant playlist update when reordering
  const { setCurrentPlaylist, currentPlaylist } = useLayoutState((state) => ({
    setCurrentPlaylist: state.setCurrentPlaylist,
    currentPlaylist: state.currentPlaylist,
  }))

  const { sortedPlaylists } = useLocalSettings(
    useShallow((state) => ({
      sortedPlaylists: state.sortedPlaylists,
    }))
  )
  const sortingSettings = sortedPlaylists.find(
    (playlist) => playlist.identifier === params?.playlistId
  )

  useEffect(() => {
    if (sortingSettings?.sortBy === 'custom' || !sortingSettings?.sortBy) {
      setCurrentPlaylist(
        playlist.data?.playlist.songs?.toSorted(sortByLexoRankAsc) ?? []
      )
    } else {
      setCurrentPlaylist(
        orderBy(
          playlist.data?.playlist.songs,
          [
            sortingSettings?.sortBy === 'dateAdded'
              ? 'createdAt'
              : sortingSettings?.sortBy,
          ],
          [sortingSettings?.direction || 'desc']
        )
      )
    }
  }, [
    playlist.data?.playlist.songs,
    setCurrentPlaylist,
    sortingSettings?.direction,
    sortingSettings?.sortBy,
  ])

  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)

  const isRadio = playlist.data?.playlist.type === playlistType.RADIO

  const onImportFromUrl = useCallback(() => {
    openModal({
      content: (
        <ImportPlaylistModal
          playlistId={params?.playlistId ?? ''}
          onImportEnd={() => {
            toast.custom(() => <Toast message='✔ Playlist imported' />, {
              duration: 3000,
            })
            closeModal()
          }}
        />
      ),
      title: `Import playlist to ${playlist.data?.playlist.name}`,
    })
  }, [openModal, closeModal, params?.playlistId, playlist.data?.playlist?.name])

  const renderSongList = () => {
    if (playlist.isError) {
      return (
        <div className='mt-[10%] flex justify-center'>
          <p>
            {getError(playlist.error as ClientError) || 'Something went wrong'}{' '}
          </p>
        </div>
      )
    }

    return (
      <SongList
        isEditable={
          playlist.data?.playlist.type === playlistType.PLAYLIST &&
          !!playlist.data.playlist.user?.id &&
          playlist.data.playlist.user.id === session.data?.user.id
        }
        onImportFromUrl={onImportFromUrl}
        identifier={params?.playlistId ?? ''}
        songs={currentPlaylist}
        showArtist
        isLoading={playlist.isPending}
        emptyMessage='This playlist is empty'
      />
    )
  }

  const playlistUser = playlist.data?.playlist?.user?.name

  const { theaterMode } = useLayoutState()

  return (
    <div className='container mx-auto flex min-h-full w-full max-w-[1920px] flex-col'>
      <Seo />
      {theaterMode ? (
        <TheaterMode />
      ) : (
        <>
          <div className='bg-gradient-blend-surface relative grid bg-top bg-no-repeat lg:grid-cols-3'>
            <header className='col-span-2 flex h-48 md:h-72'>
              <div className='z-10 mb-16 mt-auto flex w-full flex-col items-center gap-7 px-8 md:flex-row'>
                <ArtistHeader
                  subtitle={
                    playlist.isPending
                      ? ''
                      : `${
                          isRadio ? `Made for 👤${playlistUser}` : playlistUser
                        } - ${playlist.data?.playlist?.songs?.length} songs`
                  }
                  title={playlist.data?.playlist?.name ?? ''}
                  externalUrls={{}}
                />
              </div>
            </header>
            <div className='z-10 col-span-2 flex justify-center lg:col-span-1 lg:justify-end'>
              <VideoPlayerPortalContainer
                position='playlist-page'
                className='aspect-video max-w-full [&_iframe]:rounded-2xl'
              />
            </div>
          </div>
          <div className='grid'>
            <div className='md:px-8'>{renderSongList()}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default PlaylistPage
