import { addToPlaylistMutation, queryClient, userPlaylistsQuery } from '@/api'
import { Button } from '@/components/button'
import { PlayableSong } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import SimpleBar from 'simplebar-react'
import { format } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import { getError } from '@/utils/get-error'
import { ClientError } from 'graphql-request'

interface AddToPlaylistModalProps {
  song: PlayableSong
  onActionEnd?: (data: { playlistName: string; playlistId: string }) => void
}

export const AddToPlaylistModal = (props: AddToPlaylistModalProps) => {
  const { song, onActionEnd } = props

  const session = useSession()

  const userPlaylists = useQuery({
    queryKey: ['userPlaylists', session.data?.user?.id],
    queryFn: () => userPlaylistsQuery(),
    enabled: !!session.data?.user?.id,
    staleTime: Infinity,
  })

  const addToPlaylist = useMutation({
    mutationKey: ['addToPlaylist'],
    mutationFn: addToPlaylistMutation,
  })

  const confirmAddToPlaylist = async ({
    playlistId,
    playlistName,
  }: {
    playlistId: string
    playlistName: string
  }) => {
    try {
      await addToPlaylist.mutateAsync({
        playlistId: playlistId,
        songIds: song.id ? [song.id] : null,
        songs: song.id
          ? null
          : [
              {
                album: '',
                artist: song.artist,
                title: song.title,
                songUrl: song.songUrl || null,
              },
            ],
      })

      await queryClient.invalidateQueries({
        queryKey: ['userPlaylist', playlistId],
      })

      onActionEnd?.({ playlistName, playlistId })
    } catch (error) {
      void 0
    }
  }

  return (
    <div className='w-96 max-w-full p-8'>
      <div className='flex flex-col gap-2'>
        <p className='mb-2 text-center text-base'>
          {song.artist} - {song.title}
        </p>
        <p className='text-sm text-neutral-400'>
          Click on playlist to add one song
        </p>
        <SimpleBar
          className='-mx-3 max-h-[50svh] overflow-y-auto px-3'
          classNames={{
            contentEl: 'flex flex-col gap-2',
            scrollbar: 'bg-primary-500 w-1 rounded',
          }}
        >
          {userPlaylists.data?.userPlaylists.map((playlist) => (
            <Button
              key={playlist.id}
              onClick={() =>
                confirmAddToPlaylist({
                  playlistId: playlist.id,
                  playlistName: playlist.name,
                })
              }
              className='flex w-full grow flex-col gap-1 rounded-lg bg-surface-800 px-3 py-1 text-left transition-colors'
              variant='ghost'
            >
              <p className='text-base'>{playlist.name}</p>
              <p className='mt-0.5 text-xs text-gray-400'>
                {format(new Date(Number(playlist.createdAt!)), 'MM/dd/yyyy')}
              </p>
            </Button>
          ))}
        </SimpleBar>
      </div>
      <span
        className={twMerge(
          'text-primary-500 text-sm invisible',
          addToPlaylist.error && 'visible'
        )}
      >
        Error: {getError(addToPlaylist.error as ClientError | null)}
      </span>
    </div>
  )
}
