export interface IUserInformation {
  userId: number
  fullName: string
  address: string
  cityCode: string
  districtCode: string
  wardCode: string
  avatar: string
  lastLogin: string
  createdAt: string
  updatedAt: string
}
export interface IUserReferrer {
  registerId: number
  registerCode: string
  referrerId: number
  referrerCode: string
  genealogyPath: string
  createdAt: string
}

export interface User {
  id: number
  userCode: string
  email: string
  username: string
  phoneCode: string
  phoneNumber: string
  level: number
  role: number
  status: number
  createdAt: string
  updatedAt: string
  userInformation: IUserInformation
  userReferral?: IUserReferral
  userReferrer?: IUserReferrer[]
  userBonus?: IuserBonus[]
}

interface IUserReferral {
  createdAt?: string
  genealogyPath?: string
  referrerCode?: string
  referrerId?: number
  registerCode?: string
  registerId?: number
}
interface IuserBonus {
  id: number
  userId: number
  referralId: number
  orderId: number
  priceBonus: number
  type: number
  createdById: string
  updatedById: string
  createdAt: string
  updatedAt: string
  order: {
    id: number
    paymentId: number
    shipId: number
    userId: number
    fullName: string
    identification: string
    orderCode: string
    total: number
    commission: null
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
  }
}

export interface ITopReferrer extends User {
  userInformation: IUserInformation
  userReferrer: IUserReferrer[]
}

export type IListUser = {
  count: number
  rows:  User[]
}
