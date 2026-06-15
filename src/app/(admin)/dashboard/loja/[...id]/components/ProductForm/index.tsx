import { Card } from "@/components/ui/card"

type ProductFormProps = {
  product?: {
    price: number
    name?: string | undefined
    id?: string | undefined
    description?: string | null | undefined
    benefits?: string | null | undefined
    indications?: string | null | undefined
    stock?: number | undefined
    sku?: string | null | undefined
    isActive?: boolean | undefined
    isFeatured?: boolean | undefined
    images?:
      | {
          id: string
          url: string
        }[]
      | undefined
  } | null
}

const ProductForm = ({ product }: ProductFormProps) => {
  return (
    <Card>
      <h1>Formulário de Produto</h1>
    </Card>
  )
}

export default ProductForm
