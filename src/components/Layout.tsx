import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'
import Header from './Header'

const Layout = () => {
  return (
    <div className='flex items-start justify-start'>
      <SideBar />
      <div className='w-full px-8 flex-shrink'>
        <Header />
        <div className='inline-block w-[1150px] mx-0'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
