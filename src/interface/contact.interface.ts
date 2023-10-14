export interface IContact {
  id: number
  fullName: string
  email: string
  phoneNumber: string
  content: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface IListContact {
    count:number,
    rows: IContact[]
}