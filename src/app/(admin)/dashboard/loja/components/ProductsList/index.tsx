import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductDTO } from "@/dtos/categories.dto"
import { PlusCircle } from "lucide-react"

type ProductsListProps = {
  products: ProductDTO[]
  categoryName: string
}

const ProductsList = ({ products, categoryName }: ProductsListProps) => {
  return (
    <Card>
      <CardHeader className="flex w-full flex-col items-center gap-4 lg:flex-row lg:justify-between">
        <div className="text-center lg:text-left">
          <CardTitle>Produtos da Tabela - {categoryName}</CardTitle>
          <CardDescription>
            Adicione, exclua ou edite produtos da tabela.
          </CardDescription>
        </div>
        <Button>
          <PlusCircle />
          Adicionar Produto
        </Button>
      </CardHeader>
    </Card>
  )
}

export default ProductsList
