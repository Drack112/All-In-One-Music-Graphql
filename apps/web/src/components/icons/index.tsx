import type { SVGProps } from 'react'

export const SpinnerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='-ml-1 size-5 animate-spin text-white'
    fill='none'
    viewBox='0 0 24 24'
    {...props}
  >
    <circle
      cx={12}
      cy={12}
      r={10}
      stroke='currentColor'
      className='opacity-25'
    />
    <path
      fill='currentColor'
      className='opacity-75'
      d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    />
  </svg>
)

export const PreviousIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M8 8H10.6667V24H8V8ZM12.6667 16L24 24V8L12.6667 16Z'
      fill='currentColor'
    />
  </svg>
)

export const NextIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M24 24H21.3333L21.3333 8H24L24 24ZM19.3333 16L8 8L8 24L19.3333 16Z'
      fill='currentColor'
    />
  </svg>
)

export const RandomIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width='28'
    height='24'
    viewBox='0 0 28 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M2.66667 17.1968C2.66225 16.8404 2.80675 16.6366 3.12924 16.615H5.7265C6.82895 16.615 7.36614 16.6438 8.30505 15.9002C8.50446 15.7423 8.69299 15.5601 8.86979 15.3516C9.70874 14.3619 10.0088 13.1644 10.3214 11.8955C10.9278 9.43353 11.8956 6.83323 14.4694 5.80393C15.9348 5.2179 17.9418 5.32948 19.5262 5.32948H20.4986L20.5005 3.49184C20.5005 2.57479 20.7183 2.41704 21.384 3.04436L24.9902 6.44221C25.4247 6.8516 25.3649 7.11841 24.9489 7.51364L21.3884 10.8965C20.7667 11.5204 20.4864 11.3447 20.4984 10.4839V8.32518C14.2263 8.23097 14.4898 8.63109 12.7414 14.5598C12.0959 16.3966 11.116 17.6838 9.86548 18.5263C8.55767 19.4075 7.34132 19.6947 5.80402 19.6947H3.89339C2.79689 19.6947 2.6665 19.6433 2.6665 18.5309V17.1965L2.66667 17.1968ZM2.70968 7.46999C2.70526 7.82646 2.84976 8.03023 3.17242 8.0518H5.88358C6.9862 8.0518 7.52322 8.02298 8.46213 8.7666C8.66154 8.92453 8.85007 9.10672 9.02687 9.31521C9.2409 9.56769 9.41991 9.83382 9.57291 10.1111C9.84967 9.25369 10.1931 8.41249 10.6466 7.64191C10.7751 7.42364 10.912 7.21128 11.0584 7.00582C10.7379 6.67682 10.3923 6.38912 10.0231 6.14035C8.71526 5.2592 7.49891 4.97183 5.96161 4.97183H3.93691C2.84041 4.97183 2.71002 5.02323 2.71002 6.13579V7.47016L2.70968 7.46999ZM12.5476 17.3795C13.0938 18.0055 13.7712 18.5209 14.6263 18.8629C16.0917 19.4489 17.9853 19.3374 19.5697 19.3374H20.5421L20.544 21.175C20.544 22.092 20.7618 22.2498 21.4275 21.6225L25.0337 18.2246C25.4682 17.8152 25.4085 17.5484 24.9924 17.1532L21.4319 13.7703C20.8101 13.1464 20.5297 13.3222 20.542 14.1829V16.3416C15.9705 16.4102 14.9311 16.2156 14.0267 13.8099C13.9769 13.9824 13.9086 14.2177 13.6699 15.027C13.6648 15.0445 13.6592 15.0617 13.6532 15.0787L13.6538 15.0789C13.3486 15.9473 12.9782 16.7114 12.5474 17.3795H12.5476Z'
      fill='currentColor'
    />
  </svg>
)

export const LyricsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    height='100%'
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeMiterlimit: '1.5',
    }}
    version='1.1'
    viewBox='0 0 32 32'
    width='100%'
    xmlSpace='preserve'
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    {...props}
  >
    <g id='Icon' fill='currentColor'>
      <path d='M18.003,23.922l-0.001,0c-1.105,0 -2.002,0.897 -2.002,2.002c-0,1.105 0.897,2.002 2.002,2.002c1.104,-0 2.001,-0.897 2.001,-2.002l0,-7.122c0,-0 6.001,-0.75 6.001,-0.75l0.003,3.867c-1.105,-0 -2.002,0.897 -2.002,2.002c0,1.104 0.897,2.001 2.002,2.001c1.105,0 2.002,-0.897 2.002,-2.001l-0.006,-7.003c0,-0.286 -0.123,-0.559 -0.338,-0.749c-0.215,-0.19 -0.501,-0.278 -0.786,-0.242l-8,1c-0.5,0.062 -0.876,0.488 -0.876,0.992l0,6.003Z' />
      <path d='M18.003,23.922l-0.001,0c-1.105,0 -2.002,0.897 -2.002,2.002c-0,1.105 0.897,2.002 2.002,2.002c1.104,-0 2.001,-0.897 2.001,-2.002l0,-7.122c0,-0 6.001,-0.75 6.001,-0.75l0.003,3.867c-1.105,-0 -2.002,0.897 -2.002,2.002c0,1.104 0.897,2.001 2.002,2.001c1.105,0 2.002,-0.897 2.002,-2.001l-0.006,-7.003c0,-0.286 -0.123,-0.559 -0.338,-0.749c-0.215,-0.19 -0.501,-0.278 -0.786,-0.242l-8,1c-0.5,0.062 -0.876,0.488 -0.876,0.992l0,6.003Z' />
      <path
        d='M27,12.994l0.009,-6.035c-0,-0.53 -0.211,-1.039 -0.586,-1.414c-0.375,-0.375 -0.884,-0.586 -1.414,-0.586c-4.185,0 -13.824,0 -18.009,0c-0.53,0 -1.039,0.211 -1.414,0.586c-0.375,0.375 -0.586,0.884 -0.586,1.414c0,4.184 0,13.817 0,18c-0,0.531 0.211,1.04 0.586,1.415c0.375,0.375 0.884,0.585 1.414,0.585l6,0.039'
        style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 2 }}
      />
      <path
        fill='currentColor'
        d='M9.004,10l13.983,0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1l-13.983,0c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1Z'
      />
      <path d='M9.004,13.994l13.983,0c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1l-13.983,0c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1Z' />
      <path d='M9.004,18l5.981,0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-5.981,0c-0.552,-0 -1,0.448 -1,1c0,0.552 0.448,1 1,1Z' />
      <path d='M9.004,22.006l5.981,-0c0.552,-0 1,-0.448 1,-1c-0,-0.552 -0.448,-1 -1,-1l-5.981,-0c-0.552,-0 -1,0.448 -1,1c0,0.552 0.448,1 1,1Z' />
    </g>
  </svg>
)

export const TheaterModeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='100%'
    height='100%'
    viewBox='0 0 24 24'
    {...props}
  >
    <rect
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      x={1}
      y={1}
      width={22}
      height={22}
      rx={2}
      ry={2}
    />
    <rect
      x={4}
      y={5}
      width={16}
      height={9}
      rx='1.5'
      ry='1.5'
      fill='currentColor'
    />
    <circle cx={7} cy={17} r='1.5' fill='currentColor' />
    <circle cx={12} cy={17} r='1.5' fill='currentColor' />
    <circle cx={17} cy={17} r='1.5' fill='currentColor' />
  </svg>
)

export const GithubIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width='100%'
    height='100%'
    viewBox='0 0 36 36'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M18 0C8.055 0 0 8.055 0 18C0 25.965 5.1525 32.6925 12.3075 35.0775C13.2075 35.235 13.545 34.695 13.545 34.2225C13.545 33.795 13.5225 32.3775 13.5225 30.87C9 31.7025 7.83 29.7675 7.47 28.755C7.2675 28.2375 6.39 26.64 5.625 26.2125C4.995 25.875 4.095 25.0425 5.6025 25.02C7.02 24.9975 8.0325 26.325 8.37 26.865C9.99 29.5875 12.5775 28.8225 13.6125 28.35C13.77 27.18 14.2425 26.3925 14.76 25.9425C10.755 25.4925 6.57 23.94 6.57 17.055C6.57 15.0975 7.2675 13.4775 8.415 12.2175C8.235 11.7675 7.605 9.9225 8.595 7.4475C8.595 7.4475 10.1025 6.975 13.545 9.2925C14.985 8.8875 16.515 8.685 18.045 8.685C19.575 8.685 21.105 8.8875 22.545 9.2925C25.9875 6.9525 27.495 7.4475 27.495 7.4475C28.485 9.9225 27.855 11.7675 27.675 12.2175C28.8225 13.4775 29.52 15.075 29.52 17.055C29.52 23.9625 25.3125 25.4925 21.3075 25.9425C21.96 26.505 22.5225 27.585 22.5225 29.2725C22.5225 31.68 22.5 33.615 22.5 34.2225C22.5 34.695 22.8375 35.2575 23.7375 35.0775C30.8475 32.6925 36 25.9425 36 18C36 8.055 27.945 0 18 0Z'
      fill='currentColor'
    />
  </svg>
)

export const RepeatOneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='100%'
    height='100%'
    fill='currentColor'
    {...props}
  >
    <path d='M8 20V21.9325C8 22.2086 7.77614 22.4325 7.5 22.4325C7.38303 22.4325 7.26977 22.3915 7.17991 22.3166L3.06093 18.8841C2.84879 18.7073 2.82013 18.392 2.99691 18.1799C3.09191 18.0659 3.23264 18 3.38103 18H8L18 18C19.1046 18 20 17.1046 20 16V8H22V16C22 18.2091 20.2091 20 18 20H8ZM16 4V2.0675C16 1.79136 16.2239 1.5675 16.5 1.5675C16.617 1.5675 16.7302 1.60851 16.8201 1.68339L20.9391 5.11587C21.1512 5.29266 21.1799 5.60794 21.0031 5.82008C20.9081 5.93407 20.7674 5.99998 20.619 5.99998H16L6 6C4.89543 6 4 6.89543 4 8V16H2V8C2 5.79086 3.79086 4 6 4H16ZM11 8H13V16H11V10H9V9L11 8Z' />
  </svg>
)

export const RepeatIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='currentColor'
    width='100%'
    height='100%'
    {...props}
  >
    <path d='M8 20V21.9324C8 22.2086 7.77614 22.4324 7.5 22.4324C7.38303 22.4324 7.26977 22.3914 7.17991 22.3165L3.06093 18.8841C2.84879 18.7073 2.82013 18.392 2.99691 18.1799C3.09191 18.0659 3.23264 18 3.38103 18L18 18C19.1046 18 20 17.1045 20 16V7.99997H22V16C22 18.2091 20.2091 20 18 20H8ZM16 3.99997V2.0675C16 1.79136 16.2239 1.5675 16.5 1.5675C16.617 1.5675 16.7302 1.60851 16.8201 1.68339L20.9391 5.11587C21.1512 5.29266 21.1799 5.60794 21.0031 5.82008C20.9081 5.93407 20.7674 5.99998 20.619 5.99998L6 5.99997C4.89543 5.99997 4 6.8954 4 7.99997V16H2V7.99997C2 5.79083 3.79086 3.99997 6 3.99997H16Z' />
  </svg>
)

export const AudioWave = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 26' {...props}>
      <g id='audio-wave' data-name='audio-wave' className='[&>*]:[y:11px]'>
        <rect
          id='wave-5'
          className='animate-pulse-size animation-delay-[0.4s]'
          x='32'
          width='4'
          height='0'
          rx='2'
          ry='2'
          fill='currentColor'
        />
        <rect
          id='wave-4'
          className='animate-pulse-size duration-1000 animation-delay-700'
          x='24'
          y='2'
          width='4'
          height='0'
          rx='2'
          ry='2'
          fill='currentColor'
        />
        <rect
          id='wave-3'
          className='animate-pulse-size duration-1000 animation-delay-[600ms]'
          x='16'
          width='4'
          height='0'
          rx='2'
          ry='2'
          fill='currentColor'
        />
        <rect
          id='wave-2'
          className='animate-pulse-size delay-1000 duration-1000'
          x='8'
          y='5'
          width='4'
          height='0'
          rx='2'
          fill='currentColor'
          ry='2'
        />
        <rect
          id='wave-1'
          className='animate-pulse-size delay-200 duration-1000'
          y='9'
          width='4'
          height='0'
          rx='2'
          fill='currentColor'
          ry='2'
        />
      </g>
    </svg>
  )
}
