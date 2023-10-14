export interface IUserInformation {
  userId: number
  fullName: string | null
  address: string
  cityCode: string | null
  districtCode: string | null
  wardCode: string | null
  avatar: string
  lastLogin: string | null
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

export interface Users {
  id: number
  userCode: string
  email: string
  username: string | null
  phoneCode: string | null
  phoneNumber: string | null
  level: number
  role: number
  status: number
  createdAt: string
  updatedAt: string
  userInformation: IUserInformation
  userReferral: IUserReferral | null
  userReferrer: IUserReferrer[] | []
  userBonus: IuserBonus[] | []
}

interface IUserReferral {
  createdAt: string
  genealogyPath: string
  referrerCode: string
  referrerId: number
  registerCode: string
  registerId: number
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
    shipId: number | null
    userId: number
    fullName: string
    identification: string
    orderCode: string
    total: number
    commission: string | null
    totalBeforeFee: number
    email: string
    telephone: string
    from: string | null
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

export interface ITopReferrer extends Users {
  userInformation: IUserInformation
  userReferrer: IUserReferrer[]
}

export type IListUser = {
  count: number
  rows:  Users[]
}

export type IParamsListUser = {
  search?: string
  level?: number
  role?: number
  filter?: any[]
  size?: number
}
