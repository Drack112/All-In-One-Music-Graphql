import { addToPlaylistMutation, userPlaylistsQuery } from '@/api'
import { PlayableSong } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

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
}
