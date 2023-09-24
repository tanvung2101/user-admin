import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/auth/login'
import './resources/styles/index.scss'
import { Provider } from 'react-redux'
import 'react-quill/dist/quill.snow.css';
import { createBrowserRouter, Navigate, RouterProvider, useLocation } from 'react-router-dom'
import { store } from './store'
import HomePage from './pages/home/index'
import Layout from './components/Layout'
import App from './App'
import { useAppSelector } from './store/app/hook'
import axiosClient from './apis/axiosClient'
import { storage } from './utils/storage'
import { STORAGE_KEY } from './constants/storage-key'
import ProductCreate from '../src/pages/product/product-create/index'
import Product from '../src/pages/product/index'
// import './assets/styles/app.css'

axiosClient.defaults.headers.common = {
  Authorization: `Bearer ${storage.get(STORAGE_KEY.TOKEN)}`,
};
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAppSelector((state) => state.account)
  console.log(token)
  const location = useLocation()

  if (!token) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return children
}

const router = createBrowserRouter([
  {
    element: (
      <RequireAuth>
        <Layout></Layout>
      </RequireAuth>
    ),
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/product/',
        element: <Product />
      },
      {
        path: '/product/create',
        element: <ProductCreate />
      }
    ]
  },
  {
    path: 'login',
    element: <Login></Login>
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App>
        <RouterProvider router={router} />
      </App>
    </Provider>
  </React.StrictMode>
)
