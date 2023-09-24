import { Outlet } from 'react-router-dom'
import SideBar from './SideBar'
import Header from './Header'

const Layout = () => {
  return (
    <div className='w-full flex'>
      <SideBar />
      <div className='w-full px-8'>
        <Header />
        <div className='inline w-full box-border'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout
