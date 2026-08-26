import { deleteGroup } from "@/app/action/save-group"
import DialogDeleteItem from "@/components/DialogDeleteItem"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductGroupDTO } from "@/dtos/categories.dto"
import { Boxes, ChevronRight, Edit, MoreVertical, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type ProductsGroupCardProps = {
  productGroup: ProductGroupDTO
  isSelected: boolean
  onEdit: () => void
  onSelect: () => void
}

const ProductsGroupCard = ({
  productGroup,
  isSelected,
  onEdit,
  onSelect,
}: ProductsGroupCardProps) => {
  const [isOpenModalDelete, setOpenModalDelete] = useState(false)

  const handleOpenModalDelete = () => {
    setOpenModalDelete(true)
  }

  const handleConfirmDelete = async () => {
    try {
      const success = await deleteGroup(productGroup.id)

      if (success) {
        setOpenModalDelete(false)
        toast.success("Grupo deletado com sucesso!")
      } else {
        toast.error("Ocorreu um erro ao deletar o grupo.")
        setOpenModalDelete(false)
      }
    } catch (error) {
      console.error("Erro ao deletar o grupo:", error)
      setOpenModalDelete(false)
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`group relative flex h-24 max-w-72 min-w-60 flex-1 cursor-pointer items-center justify-between gap-2 rounded-md border p-2 transition-all ${
        isSelected
          ? "border-primary/20 bg-primary/10"
          : "border-gray-300 hover:bg-gray-300/10"
      } `}
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${isSelected ? "bg-primary text-white" : "text-primary bg-gray-100"}`}
      >
        <Boxes size={16} className="dark:text-black" />
      </div>

      <div className="text-center">
        <p className="font-medium">{productGroup.name}</p>
        <p className="text-xs text-gray-500">
          {productGroup.products.length} produto(s)
        </p>
      </div>

      <div className="flex items-center gap-2 transition-opacity group-hover:opacity-100 md:opacity-0">
        <ChevronRight
          size={16}
          className={`${isSelected ? "text-primary" : "text-gray-400"}`}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={handleOpenModalDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DialogDeleteItem
        isOpen={isOpenModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        label="Deseja realmente deletar essa categoria? Essa ação é irreversível."
      />
    </div>
  )
}

export default ProductsGroupCard
