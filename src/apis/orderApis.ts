import axiosClient from './axiosClient'

interface ParamsGetListOrders {
  status: number
  startDate?: string
  endDate?: string
}

const orderApis = {
  getListOrders(params: ParamsGetListOrders): Promise<[]> {
    return axiosClient.get('/api/order/list-order-with-conditions', { params })
  }
}

export default orderApis
