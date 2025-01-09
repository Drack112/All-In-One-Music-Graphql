import { Menu } from '@/components/menu'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className='relative flex w-full grow flex-col flex-wrap py-4 md:flex-row md:flex-nowrap md:py-0'>
        <main role='main' className='w-full grow'>
          <Menu />
          {children}
        </main>
      </div>
    </>
  )
}

export default MainLayout
