export interface ImageProductDTO {
  id: string
  url: string
}

export interface ProductDTO {
  id: string
  name: string
  description: string | null
  benefits: string | null
  indications: string | null
  price: number
  stock: number
  sku: string | null
  isActive: boolean
  isFeatured: boolean
  images: ImageProductDTO[]
}

export interface CategoryDTO {
  id: string
  name: string
  description: string | null
  products: ProductDTO[]
}
