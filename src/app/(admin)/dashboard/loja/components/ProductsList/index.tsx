import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductDTO } from "@/dtos/categories.dto"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

type ProductsListProps = {
  products: ProductDTO[]
  categoryName: string
  selectedCategoryId: string
}

const ProductsList = ({
  products,
  categoryName,
  selectedCategoryId,
}: ProductsListProps) => {
  return (
    <Card>
      <CardHeader className="flex w-full flex-col items-center gap-4 border-b lg:flex-row lg:justify-between">
        <div className="text-center lg:text-left">
          <CardTitle>Produtos da Tabela - {categoryName}</CardTitle>
          <CardDescription>
            Adicione, exclua ou edite produtos da tabela.
          </CardDescription>
        </div>
        <Link href={`/dashboard/loja/novo?categoryId=${selectedCategoryId}`}>
          <Button>
            <PlusCircle />
            Adicionar Produto
          </Button>
        </Link>
      </CardHeader>
    </Card>
  )
}

export default ProductsList
