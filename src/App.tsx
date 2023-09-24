import React, { FC, useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from './store/app/hook'
import { MODE_THEME } from './constants'

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
  return <>{children}</>
}

export default App
