"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CategoryDTO } from "@/dtos/categories.dto"
import CategoryForm from "../CategoryForm"
import CategoryCard from "../CategoryCard"
import { useState } from "react"
type CategoriesMenuProps = {
  categories: CategoryDTO[]
  selectedCategoryId?: string | null
  onselectCategory: (id: string) => void
}

const CategoriesMenu = ({
  categories,
  selectedCategoryId,
  onselectCategory,
}: CategoriesMenuProps) => {
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(
    null,
  )
  const selectedCategory =
    categories.find((c) => c.id === selectedCategoryId) ?? null
  return (
    <Card>
      <CardHeader className="flex justify-between gap-4">
        <div>
          <CardTitle>Gerencie suas categorias</CardTitle>
          <CardDescription>
            Gerencie os produtos em tabelas que você disponibilizará na
            plataforma.
          </CardDescription>
        </div>
        <Badge variant="outline">{categories.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => setEditingCategory(category)}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <CategoryForm
          category={editingCategory}
          onDone={() => setEditingCategory(null)}
        />
      </CardFooter>
    </Card>
  )
}

export default CategoriesMenu
