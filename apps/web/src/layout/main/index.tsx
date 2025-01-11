import { Icon } from '@iconify/react'
import { Toaster } from 'sonner'

import { Menu } from '@/components/menu'
import { ModalProvider } from '@/providers/modal-provider'
import { useLayoutState } from '@/store/use-layout-state'
import { AddToPlaylistDndContext } from '@/hooks/add-to-playlist'

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
          <main role='main' className='w-full grow'>
            <Menu />
            {children}
          </main>
          <Attribution />
          <div className='h-28' />
          <Toaster />
          <ModalProvider />
        </AddToPlaylistDndContext>
      </div>
    </>
  )
}

export default MainLayout
