import {
  addToPlaylistMutation,
  queryClient,
  updatePlaylistSongRankMutation,
} from '@/api'
import { useLayoutState } from '@/store/use-layout-state'
import { PlayableSong } from '@/types'
import {
  Data,
  DataRef,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useMutation } from '@tanstack/react-query'
import { ClientError } from 'graphql-request'
import { memo, useCallback, useMemo } from 'react'
import { arrayMove, type SortableData } from '@dnd-kit/sortable'
import { useParams } from 'next/navigation'
import { DroppableEntity } from '@/types/next-auth'
import { toast } from 'sonner'
import { getError } from '@/utils/get-error'
import { Toast } from '@/components/toast'
import { getBetweenRankAsc } from '@/utils/lexorank'
import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers'

export const isPlaylistEntity = (
  entity: DroppableEntity['current']
): entity is Data<{ name: string; id: string }> => {
  if (!entity) return false

  return 'name' in entity && 'id' in entity
}

const AddToPlaylistDndContext = memo(
  ({ children }: { children: React.ReactNode }) => {
    const { setDraggingToPlaylistEl } = useLayoutState((state) => ({
      setDraggingToPlaylistEl: state.setDraggingToPlaylistEl,
    }))

    const updatePlaylistSongRank = useMutation({
      mutationKey: ['updatePlaylistSongRank'],
      mutationFn: updatePlaylistSongRankMutation,
      onError: (err: ClientError) => err,
    })

    const onDragStart = useCallback<
      NonNullable<React.ComponentProps<typeof DndContext>['onDragStart']>
    >(
      (event) => {
        const data = (
          event.active.data as DataRef<{ items: PlayableSong[] } & SortableData>
        )?.current

        if (!data) {
          return
        }

        setDraggingToPlaylistEl({
          id: event.active.id,
          items: data.items.map((item) => ({
            title: item.title,
            artist: item.artist,
          })),
        })
      },
      [setDraggingToPlaylistEl]
    )

    const params = useParams<{ playlistId: string }>()

    const addToPlaylist = useMutation({
      mutationKey: ['addToPlaylist'],
      mutationFn: addToPlaylistMutation,
      onError: (err: ClientError) => err,
    })

    const { setCurrentPlaylist, currentPlaylist } = useLayoutState((state) => ({
      setCurrentPlaylist: state.setCurrentPlaylist,
      currentPlaylist: state.currentPlaylist,
    }))

    const onDragEnd = useCallback<
      NonNullable<React.ComponentProps<typeof DndContext>['onDragEnd']>
    >(
      async (event) => {
        const droppableEntity = (event.over?.data as DroppableEntity)?.current

        if (!droppableEntity) {
          setDraggingToPlaylistEl(null)
          return
        }

        const songs = (
          event.active.data as DataRef<{ items: PlayableSong[] } & SortableData>
        )?.current

        if (isPlaylistEntity(droppableEntity)) {
          if (!songs) {
            return
          }

          const songsHaveIds = songs.items.every((song) => !!song.id)

          try {
            await addToPlaylist.mutateAsync({
              playlistId: droppableEntity.id,
              // songs in a playlist use id
              songIds: songsHaveIds ? songs.items.map((song) => song.id!) : [],
              // songs from public artist use song data
              songs: !songsHaveIds
                ? songs.items.map((song) => ({
                    title: song.title,
                    artist: song.artist,
                    songUrl: song.songUrl || null,
                    album: '',
                  }))
                : [],
            })

            toast.custom(
              () => (
                <Toast message={`✔ Song added to ${droppableEntity.name}`} />
              ),
              {
                duration: 3500,
              }
            )

            await queryClient.invalidateQueries({
              queryKey: ['userPlaylist', droppableEntity.id],
              type: 'all',
            })
          } catch (error) {
            if (error instanceof ClientError) {
              toast.custom(() => <Toast message={`❌ ${getError(error)}`} />, {
                duration: 3500,
              })

              return
            }

            toast.custom(() => <Toast message={`❌ Something went wrong`} />, {
              duration: 3500,
            })
          } finally {
            setDraggingToPlaylistEl(null)
          }
        } else {
          const song = songs?.items[0]
          if (
            droppableEntity.items[0].id === song?.id ||
            !params?.playlistId ||
            !song?.id ||
            !songs ||
            songs.items.length !== 1
          ) {
            setDraggingToPlaylistEl(null)
            return
          }

          const oldIndex = songs.sortable.index
          const newIndex = droppableEntity.sortable.index

          if (!currentPlaylist?.length) return

          const reorderedPlaylist = arrayMove(
            currentPlaylist,
            oldIndex,
            newIndex
          )

          setCurrentPlaylist(reorderedPlaylist)

          const newRank = getBetweenRankAsc({
            previous: reorderedPlaylist[newIndex - 1],
            next: reorderedPlaylist[newIndex + 1],
            item: currentPlaylist[oldIndex],
          })

          await updatePlaylistSongRank.mutateAsync({
            playlistId: params.playlistId,
            songId: song.id,
            rank: newRank.toString(),
          })

          await queryClient.invalidateQueries({
            queryKey: ['userPlaylist', params.playlistId],
          })
        }

        setDraggingToPlaylistEl(null)
      },
      [
        addToPlaylist,
        currentPlaylist,
        params?.playlistId,
        setCurrentPlaylist,
        setDraggingToPlaylistEl,
        updatePlaylistSongRank,
      ]
    )

    const pointerSensor = useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })

    const sensors = useSensors(pointerSensor)

    const modifiers = useMemo(
      () => [snapCenterToCursor, restrictToWindowEdges],
      []
    )

    const onDragCancel = useCallback(() => {
      setDraggingToPlaylistEl(null)
    }, [setDraggingToPlaylistEl])

    return (
      <DndContext
        onDragStart={onDragStart}
        sensors={sensors}
        onDragEnd={onDragEnd}
        modifiers={modifiers}
        onDragCancel={onDragCancel}
      >
        {children}
      </DndContext>
    )
  }
)

AddToPlaylistDndContext.displayName = 'AddToPlaylistDndContext'

export { AddToPlaylistDndContext }
