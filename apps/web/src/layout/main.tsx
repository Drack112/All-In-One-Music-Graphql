import { Menu } from '@/components/menu'
import { Modal } from '@/components/modal/modal'
import { Toaster } from 'sonner'
import { Icon } from '@iconify/react'
import { useLayoutState } from '@/store/use-layout-state'

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
        <main role='main' className='w-full grow'>
          <Menu />
          {children}
        </main>
        <Attribution />
        <div className='h-28' />
        <Toaster />
        <Modal />
      </div>
    </>
  )
}

export default MainLayout
