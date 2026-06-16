"use client"

import { Button } from "@/components/ui/button"
import { ProductDTO } from "@/dtos/categories.dto"
import { formatCurrency } from "@/helpers/format-currency"
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react"
import Link from "next/link"

type ProductCardProps = {
  product: ProductDTO
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <li className="group bg-card hover:border-primary/50 flex items-center justify-between gap-6 rounded-md border p-3 transition-all">
      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-medium">{product.name}</span>
        <span className="text-xs font-semibold text-green-600">
          {formatCurrency(product.price)}
        </span>
      </div>
      <div className="flex gap-1 transition-opacity group-hover:opacity-100 sm:opacity-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-transform hover:scale-110"
        >
          {product.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
        </Button>
        <Link href={`/dashboard/loja/${product.id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-transform hover:scale-110"
          >
            <Edit size={14} />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 h-8 w-8"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </li>
  )
}

export default ProductCard
