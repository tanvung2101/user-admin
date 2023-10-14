import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/auth/login'
import './resources/styles/index.scss'
import './style.css'
import { Provider } from 'react-redux'
import 'react-quill/dist/quill.snow.css'
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
import ProductCategory from '../src/pages/product-category/index'
import ProductOrigin from '../src/pages/product-origin'
import ProductAttribute from '../src/pages/product-attribute'
import CommingSoon from '../src/pages/comming-soon'
import Order from '../src/pages/order/index'
import OrderDetail from '../src/pages/order/order-detail'
import SalesStatistics from '../src/pages/sales-statistics'
import Contact from '../src/pages/contact/index'
import User from '../src/pages/user'
// import './assets/styles/app.css'

axiosClient.defaults.headers.common = {
  Authorization: `Bearer ${storage.get(STORAGE_KEY.TOKEN)}`
}
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
      },
      {
        path: '/product-category',
        element: <ProductCategory />
      },
      {
        path: '/product-origin',
        element: <ProductOrigin />
      },
      {
        path: '/product-attribute',
        element: <ProductAttribute />
      },
      {
        path: '/order',
        element: <Order />
      },
      {
        path: '/order-new',
        element: <CommingSoon />
      },
      {
        path: '/order-detail/:orderCode',
        element: <OrderDetail />
      },
      {
        path: 'sales-statistics',
        element: <SalesStatistics />
      },
      {
        path: 'user',
        element: <User />
      },
      {
        path: 'contact',
        element: <Contact />
      },
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
