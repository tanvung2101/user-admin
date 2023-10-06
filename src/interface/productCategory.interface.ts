export interface IProductCategory {
    id: number
    name: string
    categorySlug: string
    image: string
    description: string
    note: string
    status: number
    createdById: string
    updatedById: string
    createdAt: string
    updatedAt: string
  }

export interface IListProductCategory {
  count:number
  rows: IProductCategory[]
}