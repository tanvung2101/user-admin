

export interface orderPayment {
  id: number
  paymentMethod: number
  createdById: string
  updatedById: string
  createdAt: string
  updatedAt: string
}

export interface orderItem {
  id: number
  orderId: number
  productId: number
  subProductId: number
  userId: number
  quantity: number
  price: number
  createdById: string
  updatedById: string
  createdAt: string
  updatedAt: string
}
export interface IOrder {
    id: number
    paymentId: number
    shipId: number
    userId: number
    fullName: string
    identification: string
    orderCode: string
    total: number
    commission: string
    totalBeforeFee: number
    email: string
    telephone: string
    from: string
    address: string
    cityCode: number
    districtCode: number
    wardCode: number
    note: string
    orderDate: string
    orderStatus: number
    referralCode: string
    createdById: string
    updatedById: string
    createdAt: string
    updatedAt: string
    orderPayment:orderPayment,
    orderItem: orderItem[]
  }
export type IListPagingOrder = {
    count: number
    rows: IOrder[]
  }
