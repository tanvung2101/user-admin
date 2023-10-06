export interface IMasterLevel {
  id: number
  idMaster: number
  nameMaster: string
  name: string
  note?: string
  status?: number
  createdById?: number
  updatedById?: number
  createdAt?: string
  updatedAt?: string
}

export interface IListPagingConfigData {
  count:number,
  rows: IMasterLevel[]
}
