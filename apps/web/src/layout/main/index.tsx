import { Icon } from '@iconify/react'
import { Toaster } from 'sonner'

import { Menu } from '@/components/menu'
import { ModalProvider } from '@/providers/modal-provider'
import { useLayoutState } from '@/store/use-layout-state'
import { AddToPlaylistDndContext } from '@/hooks/add-to-playlist'
import { FooterPlayer } from '@/components/player'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { VideoPlayer } from '@/components/video-player'

const VideoPlayerPortal = () => {
  const videoPosition = useLayoutState((state) => state.videoPosition)

  const [domReady, setDomReady] = useState(false)

  useEffect(() => {
    setDomReady(true)
  }, [])

  const container = domReady
    ? document.querySelector(`[data-${videoPosition}]`)
    : null

  return domReady && container ? createPortal(<VideoPlayer />, container) : null
}

const Attribution = () => {
  const theaterMode = useLayoutState((state) => state.theaterMode)

  if (theaterMode) return null

  const currentYear = new Date().getFullYear()

  return (
    <div className='mx-auto flex w-fit items-center gap-1 py-4'>
      <p className='text-xs text-gray-400'>
        Made with ❤️ for music | {currentYear} Drack |
      </p>
      <a
        href='https://github.com/Drack112/All-In-One-Music-Graphql'
        target='_blank'
        rel='noreferrer noopener'
        className='transition-colors hover:text-primary-500'
      >
        <Icon icon='mdi:github' className='size-4 shrink-0' />
      </a>
    </div>
  )
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='relative flex w-full grow flex-col flex-wrap py-4 md:flex-row md:flex-nowrap md:py-0'>
        <AddToPlaylistDndContext>
          <Menu />
          <main role='main' className='w-full grow'>
            {children}
          </main>
        </AddToPlaylistDndContext>
      </div>
      <Attribution />
      <div className='h-28' />
      <FooterPlayer />
      <Toaster />
      <ModalProvider />
      <VideoPlayerPortal />
    </>
  )
}

export default MainLayout
