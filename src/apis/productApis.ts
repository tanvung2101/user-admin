import { IListProduct } from '../interface/product.interface'
import axiosClient from './axiosClient'

type payload = {
  name: string
  description: string
  productSlug: string
  mainImage: string | undefined
  outstanding: number
  element?: string
  uses?: string
  guide?: string
  nameVi?: string
  expiry?: string
  acronym?: string
  categoryId: number
  productDetail: {
    price: number
    quantity: number
    unitId: number
    capacityId: number
  }[]
  originId?: number
}

const productApis = {
  getListProduct: (params: {
    categoryId?: number
    admin?: boolean
    name?: string
    size?: number
  }): Promise<IListProduct> => axiosClient.get('/api/product', { params }),
  createProduct: (payload: payload) => axiosClient.post('/api/product/new-product', payload),
  changeStatusProduct: (payload: { id: number; status: number }): Promise<boolean> =>
    axiosClient.put('/api/product/change-status-product', payload)
}

export default productApis
