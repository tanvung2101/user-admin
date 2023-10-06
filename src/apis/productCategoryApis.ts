import axiosClient from './axiosClient'
import { IListProductCategory, IProductCategory } from '../interface/productCategory.interface'

const productCategoryApis = {
  getListPagingProductCategory: (params: { name?: string; size?: number }): Promise<IListProductCategory> =>
    axiosClient.get('/api/product/get-list-category-with-paging', { params }),
  getAllCategory: (): Promise<IProductCategory[]> => axiosClient.get('/api/product/get-list-category'),
  createProductCategory: (payload: { name: string; categorySlug: string }): Promise<boolean> =>
    axiosClient.post('/api/product/new-category', payload),
  updateCategory: (payload: {
    id: number
    name: string
    categorySlug: string
    description?: string
    image?: string
  }): Promise<boolean> => axiosClient.put('/api/product/update-category', payload),
  updateStatusCategory: (payload: { id: number; status: number }): Promise<boolean> =>
    axiosClient.put('/api/product/change-status-product-category', payload),
  getDetailCategory: (id: number): Promise<IProductCategory> => axiosClient.get(`/api/product/detail-category/${id}`)
}

export default productCategoryApis
