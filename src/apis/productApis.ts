import { IListProduct } from '../interface/product.interface'
import axiosClient from './axiosClient'

const productApis = {
  getListProduct: (params: {
    categoryId?: number
    admin?: boolean
    name?: string
    size?: number
  }): Promise<IListProduct> => axiosClient.get('/api/product', { params }),
  changeStatusProduct: (payload: {id: number, status: number}):Promise<boolean> => axiosClient.put('/api/product/change-status-product', payload)
}

export default productApis
