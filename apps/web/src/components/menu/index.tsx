import {
  ArrowLeftStartOnRectangleIcon,
  MusicalNoteIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import type { Variants } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { useGlobalSearchStore } from '@/store/use-global-search'
import { useModalStore } from '@/store/use-modal'
import { useLayoutState } from '@/store/use-layout-state'
import { Skeleton } from '../skeleton'
import { MyAccountModal } from '../modals/account/info'
import { AuthModal } from '../modals/auth'
import { PlaylistMenu } from './playlist'

interface MenuItemProps {
  children: React.ReactNode
  icon: JSX.Element
  href?: string
  onClick?: () => void
  className?: string
  active?: boolean
  loading?: boolean
  tag?: 'button' | 'a' | 'div'
}

const MenuItem = ({
  children,
  icon,
  href,
  onClick,
  className,
  active,
  loading,
  tag = 'button',
}: MenuItemProps) => {
  const router = useRouter()

  const activeClassname =
    (active ?? router.pathname === href)
      ? `stroke-primary-500 text-primary-500`
      : ''

  const Wrapper = href ? Link : tag

  return (
    <li
      className={twMerge(
        `group hover:bg-surface-900 rounded-3xl transition-colors duration-300`,
        (active ?? router.pathname === href) && 'bg-surface-900',
        className
      )}
    >
      <Wrapper
        href={href || '#'}
        className={twMerge(
          'block truncate md:w-full md:px-8 md:py-5 py-2',
          loading && 'cursor-wait'
        )}
        onClick={onClick}
      >
        <span className='flex md:flex-col md:items-center'>
          {React.cloneElement<HTMLElement>(icon, {
            className: `w-7 md:mx-2 mx-4 inline transition-colors ${activeClassname}`,
          })}
          <span
            className={`hidden text-sm transition-colors md:inline ${activeClassname}`}
          >
            {children}
          </span>
        </span>
      </Wrapper>
    </li>
  )
}

const navAnim: Variants = {
  hidden: {
    x: '-100%',
    opacity: 0,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
}

const DynamicPopover = dynamic(
  async () => (await import('../popover')).Popover,
  {
    ssr: false,
  }
)

export const Menu = () => {
  const setIsOpen = useGlobalSearchStore((state) => state.setIsOpen)
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const theaterMode = useLayoutState((state) => state.theaterMode)

  const isPlaylistMenuOpen = useLayoutState((state) => state.playlistMenuOpen)
  const setIsPlaylistMenuOpen = useLayoutState(
    (state) => state.setPlaylistMenuOpen
  )

  const session = useSession()

  if (theaterMode) {
    return null
  }

  const renderAccountOption = () => {
    if (session.status === 'loading') {
      return (
        <MenuItem className='mt-auto' loading icon={<UserIcon />}>
          <Skeleton className='mt-1 h-4 w-14' />
        </MenuItem>
      )
    }

    if (session.status === 'authenticated')
      return (
        <DynamicPopover
          className='mt-auto'
          direction='top start'
          menuLabel={(open) => (
            <MenuItem icon={<UserIcon />} tag='div' active={open}>
              Account
            </MenuItem>
          )}
          menuItems={[
            {
              label: 'My Account',
              onClick: () => {
                openModal({
                  content: <MyAccountModal onClose={closeModal} />,
                  title: 'My Account',
                })
              },
              icon: <UserIcon className='mr-2 h-5 shrink-0' />,
            },
            {
              label: 'Sign Out',
              onClick: async () => {
                if (session.status === 'authenticated') {
                  await signOut({ redirect: false })
                  return
                }
              },
              icon: (
                <ArrowLeftStartOnRectangleIcon className='mr-2 h-5 shrink-0' />
              ),
            },
          ]}
        />
      )

    return (
      <MenuItem
        className='mt-auto'
        onClick={() => {
          openModal({
            content: <AuthModal onClose={closeModal} />,
            title: 'Sign In',
          })
        }}
        icon={<UserIcon />}
      >
        Sign In
      </MenuItem>
    )
  }

  return (
    <>
      <div className='shrink-0 md:w-36'></div>
      <AnimatePresence>
        {isPlaylistMenuOpen && (
          <motion.div
            className='hidden xl:block'
            initial='hidden'
            exit='hidden'
            animate='show'
            variants={{
              hidden: {
                marginRight: 0,
                opacity: 0,
              },
              show: {
                opacity: 1,
                marginRight: '16rem',
                transition: {
                  duration: 0.2,
                },
              },
            }}
          />
        )}
      </AnimatePresence>
      <div className='sticky top-0 z-40 size-full px-4 md:fixed md:z-20 md:w-36 md:px-0'>
        <div className='sticky top-0 flex h-full grow rounded-[40px] bg-surface-950 p-4 md:rounded-none md:p-0 md:pb-28'>
          <div className='relative flex w-full'>
            <ul className='z-10 flex w-full items-center justify-between bg-surface-950 md:flex-col md:gap-4 md:py-10'>
              <MenuItem href='/' icon={<HomeIcon />}>
                Home
              </MenuItem>
              <MenuItem
                onClick={() => setIsOpen(true)}
                icon={<MagnifyingGlassIcon />}
              >
                Search
              </MenuItem>
              <MenuItem
                onClick={() => setIsPlaylistMenuOpen(!isPlaylistMenuOpen)}
                icon={<MusicalNoteIcon />}
                active={isPlaylistMenuOpen}
              >
                Playlists
              </MenuItem>
              {renderAccountOption()}
            </ul>
            <AnimatePresence>
              {isPlaylistMenuOpen && (
                <motion.div
                  className='absolute -left-8 top-16 h-[calc(100svh-12.25rem)] w-64 rounded-r-3xl bg-surface-950 md:-right-64 md:-top-0 md:left-auto md:h-full md:max-h-full'
                  initial='hidden'
                  exit='hidden'
                  animate='show'
                  variants={navAnim}
                >
                  <PlaylistMenu />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}
