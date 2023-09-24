interface IProductCategory {
  id: number
  name: string
  categorySlug: string
  image: string
  description?: string
  note?: string
  status?: number
  createdById?: string
  updatedById?: string
  createdAt?: string
  updatedAt?: string
}

interface IProductInventory {
  id: number
  productId: number
  subProductId?: number
  quantity?: number
  cityCode?: string
  createdById?: string
  updatedById?: string
  createdAt?: string
  updatedAt?: string
}

export interface IProductImage {
  id: number
  productId: number
  image: string
  isMain: 1
  createdById: symbol
  updatedById: symbol
  createdAt: string
  updatedAt: string
}

export interface IProductDetail {
  id: number
  productId: number
  unitId: number
  capacityId: number
  price: number
  createdById: string
  updatedById: string
  createdAt: string
  updatedAt: string
}

export interface IProduct {
  id: number
  categoryId: number
  discountId: string
  productSlug: string
  name: string
  nameVi: string
  acronym: string
  typeProduct: string
  purposeUse: string
  unitId: string
  branchId: string
  description: string
  element: string
  uses: string 
  guide: string 
  price: number 
  outstanding: number
  originId: number 
  capacityId: number 
  expiry: string 
  colorId: string 
  status: number | null 
  policy: string 
  createdById: string 
  updatedById: string 
  createdAt: string
  updatedAt: string 
  productCategory: IProductCategory
  discount: null
  productInventory: IProductInventory[]
  productImage: IProductImage[]
  productDetail: IProductDetail[]
}

export interface IListProduct {
    count: number,
    rows: IProduct[]
}
