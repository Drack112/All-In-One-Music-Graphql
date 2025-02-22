import { getAlbumDetailsQuery, getAlbumsQuery } from '@/api'
import { Button } from '@/components/button'
import { Skeleton } from '@/components/skeleton'
import { SongList } from '@/components/song-list'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { sortablePropertiesMapping } from '@/constants'
import {
  ArtistSortableProperties,
  useLocalSettings,
} from '@/store/use-local-settings'
import { ArrowLeftIcon, PlayIcon } from '@heroicons/react/24/solid'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Fuse from 'fuse.js'
import { maxBy, orderBy } from 'lodash'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

interface ArtistAlbumProps {
  album: string
  coverImage?: string
  songs: string[]
  artist: string
  description?: string
  albumId?: string
}

const ArtistAlbum = (props: ArtistAlbumProps) => {
  const {
    album,
    coverImage,
    songs,
    artist,
    description: defaultDescription,
    albumId,
  } = props

  const [readMore, setReadMore] = useState(false)

  const getAlbumDetails = useQuery({
    queryKey: ['getAlbumDetails', albumId, album, artist],
    queryFn: () =>
      getAlbumDetailsQuery({ albumId: albumId ?? '', album, artist }),
    enabled: !!album && !!artist,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const albumSongs = getAlbumDetails.data?.albumDetails.tracks
  const description =
    defaultDescription || getAlbumDetails.data?.albumDetails.description

  console.log(defaultDescription, getAlbumDetails.data?.albumDetails)

  const identifier = `${artist}-${album}`

  const playableSongs = useMemo(() => {
    const hasExternalSongs = albumSongs && albumSongs.length > 0

    return (hasExternalSongs ? albumSongs : songs).map((song) => ({
      title: song,
      artist: artist,
      albumCoverUrl: coverImage,
    }))
  }, [albumSongs, songs, artist, coverImage])

  const { sortedPlaylists } = useLocalSettings(
    useShallow((state) => ({
      sortedPlaylists: state.sortedPlaylists,
    }))
  )
  const sortingSettings = sortedPlaylists.find(
    (playlist) => playlist.identifier === identifier
  )

  const sortBySetting = sortingSettings?.sortBy || 'default'

  const sortedPlayableSongs = useMemo(() => {
    return orderBy(
      playableSongs,
      sortablePropertiesMapping[sortBySetting as ArtistSortableProperties],
      [sortingSettings?.direction || 'desc']
    )
  }, [playableSongs, sortBySetting, sortingSettings?.direction])

  return (
    <div>
      <div className='mb-4 flex flex-col md:flex-row'>
        <div className='mx-auto shrink-0 md:mx-0'>
          <Image
            alt={album}
            width={136}
            height={136}
            quality={80}
            src={coverImage || '/cover-placeholder.png'}
            className='rounded-md object-cover'
          />
        </div>
        <div className='flex flex-col px-4 py-3'>
          <h3
            className={`mb-2 block font-semibold ${
              description
                ? 'text-xl md:text-2xl'
                : 'mt-auto text-2xl md:text-3xl'
            }`}
          >
            {album}
          </h3>
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <p
                className={`text-sm leading-relaxed ${
                  readMore ? '' : 'line-clamp-4'
                }`}
              >
                {description}
              </p>
              {description.split(' ').length > 50 && (
                <button
                  type='button'
                  className='w-fit text-sm text-primary-500 hover:underline'
                  onClick={() => setReadMore(!readMore)}
                >
                  {readMore ? 'Read less' : 'Read more'}
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <SongList
        identifier={identifier}
        songs={sortedPlayableSongs}
        isLoading={getAlbumDetails.isPending}
      />
    </div>
  )
}

interface ArtistAlbumsProps {
  artist: string
  selectedAlbum?: string
  onAlbumSelect: (album: string) => void
}

export const ArtistAlbums = (props: ArtistAlbumsProps) => {
  const { artist, selectedAlbum: selectedAlbumName, onAlbumSelect } = props

  const [selectedLimit, setSelectedLimit] = useState('40')

  const getAlbums = useQuery({
    queryKey: ['getAlbums', artist, parseInt(selectedLimit)],
    queryFn: () => getAlbumsQuery({ artist, limit: parseInt(selectedLimit) }),
    staleTime: Infinity,
    gcTime: Infinity,
    placeholderData: keepPreviousData,
  })

  const albums = useMemo(() => {
    if (!getAlbums.data?.getAlbums) {
      return []
    }

    return getAlbums.data.getAlbums
  }, [getAlbums.data?.getAlbums])

  const fuse = useMemo(() => {
    return new Fuse(albums, {
      keys: ['name'],
      threshold: 0.2,
      distance: 6,
      includeScore: true,
    })
  }, [albums])

  // minimal fuzzy search to avoid albums with similar names
  const filteredAlbums = useMemo(() => {
    const uniqueAlbums = new Set<(typeof albums)[number]>()
    const ignoredAlbums = new Set<string>()

    albums.forEach((album) => {
      const matches = fuse.search(album.name)

      if (matches.length > 0) {
        const bestMatch = maxBy(
          matches,
          (match) =>
            (match.item.coverImage?.length ?? 0) +
            -match.item.name.length +
            (match.item.description?.length ?? 0) +
            Number(match.item.year ? Infinity : 0)
        )

        if (!bestMatch) return

        const otherMatches = matches.filter(
          (match) => match.item.name !== bestMatch.item.name
        )

        if (bestMatch && !ignoredAlbums.has(bestMatch.item.name)) {
          otherMatches.forEach((match) => {
            // albums with year are never ignored
            if (match.item.year) return

            ignoredAlbums.add(match.item.name)
          })
          uniqueAlbums.add(bestMatch.item)
        }
      }
    })

    return Array.from(uniqueAlbums)
  }, [albums, fuse])

  const selectedAlbum = useMemo(() => {
    return albums?.find((album) => album.name === selectedAlbumName)
  }, [albums, selectedAlbumName])

  const renderContent = () => {
    if (selectedAlbumName && selectedAlbum) {
      return (
        <>
          <button
            type='button'
            className='mb-4 flex items-center'
            onClick={() => {
              onAlbumSelect('')
            }}
          >
            <ArrowLeftIcon className='mr-2 inline-block h-6 text-primary-500' />
            <h3 className='text-xl font-semibold'>Albums</h3>
          </button>
          <ArtistAlbum
            album={selectedAlbumName}
            artist={artist}
            songs={selectedAlbum?.tracks || []}
            coverImage={selectedAlbum?.coverImage || undefined}
            description={selectedAlbum?.description || undefined}
            albumId={selectedAlbum?.albumId || undefined}
          />
        </>
      )
    }

    return (
      <>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-xl font-semibold'>Albums</h3>
          <Select value={selectedLimit} onValueChange={setSelectedLimit}>
            <SelectTrigger className='w-fit'>
              Limit:
              <Button variant='secondary'>{selectedLimit}</Button>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='40'>40</SelectItem>
              <SelectItem value='60'>60</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='-mx-2 -mr-1 flex flex-wrap'>
          {getAlbums.isPending
            ? Array.from({ length: 12 }).map((_, i) => (
                <div
                  className='mb-5 flex h-36 w-1/2 flex-col px-2 sm:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6'
                  key={i}
                >
                  <Skeleton className='size-full rounded-md object-cover' />
                </div>
              ))
            : filteredAlbums?.map((album, i) => {
                return (
                  <div
                    key={album.name + i}
                    className='mb-5 flex w-1/2 flex-col px-2 sm:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6'
                  >
                    <button
                      type='button'
                      onClick={() => {
                        onAlbumSelect(album.name)
                      }}
                    >
                      <div className='group relative'>
                        <Image
                          alt={album.name}
                          width={164}
                          height={164}
                          quality={80}
                          src={album.coverImage || '/cover-placeholder.png'}
                          className='w-full rounded-md object-cover'
                        />
                        <div className='invisible absolute left-0 top-0 flex size-full items-center justify-center transition-colors group-hover:visible group-hover:bg-black/30'>
                          <PlayIcon className='size-10 text-transparent transition-colors group-hover:text-primary-500' />
                        </div>
                      </div>
                      <span className='text-center text-sm'>
                        {album.name}{' '}
                        <span className='text-xs text-gray-300'>
                          {album.year ? `(${album.year})` : ''}
                        </span>
                      </span>
                    </button>
                  </div>
                )
              })}
        </div>
      </>
    )
  }

  return <div className='p-4 pt-6'>{renderContent()}</div>
}
