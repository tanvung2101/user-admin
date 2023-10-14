import { IListPagingOrder } from '../interface/order.interface'
import axiosClient from './axiosClient'

interface ParamsGetListOrders {
  status: number
  startDate?: string
  endDate?: string
}

const orderApis = {
  updateOrder: (
    id: number,
    payload: { status: number; productDetail: { quantity: number; productId: number; subProductId: number }[] }
  ):Promise<boolean> => axiosClient.put(`/api/order/update-order/${id}`, payload),
  getListOrders(params: ParamsGetListOrders): Promise<[]> {
    return axiosClient.get('/api/order/list-order-with-conditions', { params })
  },
  getListPagingOrder: (params: { fullName?: string; orderStatus?: number; size?: number }): Promise<IListPagingOrder> =>
    axiosClient.get('/api/order/list-order', { params })
}

export default orderApis
