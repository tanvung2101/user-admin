import React, { FC, useEffect, } from 'react'
import { useAppSelector } from './store/app/hook'
import { MODE_THEME } from './constants'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const App: FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useAppSelector((state) => state.common.theme)
  useEffect(() => {
    switch (theme) {
      case MODE_THEME.DARK:
        document.documentElement.classList.add('dark')
        document.documentElement.classList.remove('light')
        break
      case MODE_THEME.LIGHT:
      default:
        document.documentElement.classList.add('light')
        document.documentElement.classList.remove('dark')
        break
    }
  }, [theme])
  console.log(theme)
  return (
    <>
      {children}
      <ToastContainer
        position='top-right'
        // transition={Zoom}
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  )
}

export default App
