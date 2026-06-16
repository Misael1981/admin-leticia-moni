"use client"

import { deleteProduct } from "@/app/action/save-product"
import { toggleProductVisibility } from "@/app/action/toggle-product-visibility"
import DialogDeleteItem from "@/components/DialogDeleteItem"
import { Button } from "@/components/ui/button"
import { ProductDTO } from "@/dtos/categories.dto"
import { formatCurrency } from "@/helpers/format-currency"
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

type ProductCardProps = {
  product: ProductDTO
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [visibilityMap, setVisibilityMap] = useState(product.isActive)
  const [isOpenModalDelete, setOpenModalDelete] = useState(false)

  const handleToggleVisibility = async () => {
    const newValue = !product.isActive

    setVisibilityMap(newValue)

    const res = await toggleProductVisibility(product.id, newValue)

    if (res.success) {
      toast.success(res.message)
    } else {
      toast.error(res.error)
      setVisibilityMap(!newValue)
    }
  }

  const handleOpenModalDelete = () => {
    setOpenModalDelete(true)
  }

  const handleConfirmDelete = async () => {
    try {
      const success = await deleteProduct(product.id)

      if (success) {
        setOpenModalDelete(false)
        toast.success("Produto deletado com sucesso!")
      } else {
        toast.error("Ocorreu um erro ao deletar o produto.")
        setOpenModalDelete(false)
      }
    } catch (error) {
      console.error("Erro ao deletar o produto:", error)
      setOpenModalDelete(false)
    }
  }

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
          onClick={handleToggleVisibility}
        >
          {visibilityMap ? <Eye size={14} /> : <EyeOff size={14} />}
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
          onClick={handleOpenModalDelete}
        >
          <Trash2 size={14} />
        </Button>
      </div>

      <DialogDeleteItem
        isOpen={isOpenModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        label="Deseja realmente deletar o Produto? Essa ação é irreversível."
      />
    </li>
  )
}

export default ProductCard
