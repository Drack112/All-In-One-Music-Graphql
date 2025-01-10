import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { twMerge } from 'tailwind-merge'

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

export const MenuItem = ({
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
