"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductGroupDTO } from "@/dtos/categories.dto"
import ProductsGroupCard from "../ProductsGroupCard"
import { useState } from "react"
import GroupForm from "../GroupForm"

type ProductsGroupSectionProps = {
  categoryName?: string
  selectedCategoryId: string
  productGroup: ProductGroupDTO[]
  selectedGroupId: string | null
  onSelectGroup: (id: string) => void
}

const ProductsGroupSection = ({
  categoryName,
  selectedCategoryId,
  productGroup,
  selectedGroupId,
  onSelectGroup,
}: ProductsGroupSectionProps) => {
  const [editingGroup, setEditingGroup] = useState<ProductGroupDTO | null>(null)

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Grupo de Produtos - {categoryName}</CardTitle>
          <CardDescription>
            Crie grupos em que os produtos ficarão separados dentro das
            categorias. Ex: Grupo Linha Infantil dentro da categoria Óleos
            Essenciais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {productGroup.map((p) => (
              <ProductsGroupCard
                key={p.id}
                productGroup={p}
                isSelected={p.id === selectedGroupId}
                onEdit={() => setEditingGroup(p)}
                onSelect={() => onSelectGroup(p.id)}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t">
          <GroupForm
            group={editingGroup}
            onDone={() => setEditingGroup(null)}
            selectedCategoryId={selectedCategoryId}
          />
        </CardFooter>
      </Card>
    </section>
  )
}

export default ProductsGroupSection
