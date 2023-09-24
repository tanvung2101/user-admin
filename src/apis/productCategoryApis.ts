import axiosClient from './axiosClient'
import {IProductCategory} from '../interface/productCategory.interface'

const productCategoryApis = {
  getAllCategory: (): Promise<
  IProductCategory[]
  > => axiosClient.get('/api/product/get-list-category')
}

export default productCategoryApis
