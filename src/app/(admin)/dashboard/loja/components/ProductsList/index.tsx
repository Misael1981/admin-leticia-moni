"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductDTO } from "@/dtos/categories.dto"
import { ChevronDown, ChevronUp, PlusCircle } from "lucide-react"
import Link from "next/link"
import SearchProduct from "../SearchProduct"
import { useState } from "react"
import ProductCard from "../ProductCard"

type ProductsListProps = {
  products: ProductDTO[]
  categoryName: string
  groupId: string
}

const ProductsList = ({
  products,
  categoryName,
  groupId,
}: ProductsListProps) => {
  const [showList, setShowList] = useState(false)

  return (
    <Card>
      <CardHeader className="flex w-full flex-col items-center gap-4 border-b lg:flex-row lg:justify-between">
        <div className="text-center lg:text-left">
          <CardTitle>Produtos da Tabela - {categoryName}</CardTitle>
          <CardDescription>
            Adicione, exclua ou edite produtos da tabela.
          </CardDescription>
        </div>
        <Link href={`/dashboard/loja/novo?groupId=${groupId}`}>
          <Button>
            <PlusCircle />
            Adicionar Produto
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <SearchProduct />
      </CardContent>

      <CardFooter className="flex w-full flex-col items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowList((prev) => !prev)}
          className="text-muted-foreground hover:text-primary"
        >
          {showList ? (
            <ChevronUp className="mr-2" size={16} />
          ) : (
            <ChevronDown className="mr-2" size={16} />
          )}
          {showList ? "Ocultar Lista" : `Ver Lista (${products.length})`}
        </Button>

        <div className="flex w-full items-center justify-center">
          {showList && (
            <ul className="animate-in fade-in slide-in-from-top-2 w-full max-w-md space-y-2 duration-300">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}

              {products.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  Nenhum produto encontrado.
                </p>
              )}
            </ul>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default ProductsList
