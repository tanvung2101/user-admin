export interface AuthUserResponse {
  id: number
  userCode: string
  email: string
  username: string | null
  phoneCode: number
  phoneNumber: string
  level: number
  role: number
  status: number
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: AuthUserResponse
}

export interface LoginData {
  email: string
  password: string
}

export interface Order {
  address: string
  cityCode: string
  commission: string
  createdAt: string
  createdById: string
  districtCode: 484
  email: string
  from: string
  fullName: string
  id: number
  identification: string
  note: string
  orderCode: string
  orderDate: string
  orderStatus: number
  paymentId: number
  referralCode: number
  shipId: number
  telephone: string
  total: number
  totalBeforeFee: number
  updatedAt: string
  updatedById: string
  userId: number
  wardCode: number
}
