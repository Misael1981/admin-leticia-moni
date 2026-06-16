"use client"

import { CategoryDTO } from "@/dtos/categories.dto"
import CategoriesMenu from "../CategoriesMenu"
import { useReducer } from "react"
import { catalogReducer } from "@/reducers/menuReducer"
import SelectedCategorieName from "../SelectedCategorieName"
import ProductsList from "../ProductsList"

type ManageCategoriesProps = {
  categories: CategoryDTO[]
}

const ManageCategories = ({ categories }: ManageCategoriesProps) => {
  const [state, dispatch] = useReducer(catalogReducer, {
    categories: categories,
    selectedCategoryId: categories[0]?.id ?? null,
    selectedProductId: null,
    isCreateCategoryModalOpen: false,
    isEditCategoryModalOpen: false,
    isDeleteCategoryModalOpen: false,
  })

  const handleSelectCategory = (id: string) => {
    dispatch({ type: "SELECT_CATEGORY", payload: id })
  }

  const selectedCategory =
    state.categories.find((c) => c.id === state.selectedCategoryId) ?? null

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <CategoriesMenu
        categories={state.categories}
        selectedCategoryId={state.selectedCategoryId}
        onselectCategory={handleSelectCategory}
      />

      <SelectedCategorieName categoryName={selectedCategory?.name ?? ""} />

      <ProductsList
        categoryName={selectedCategory?.name ?? ""}
        products={selectedCategory?.products ?? []}
        selectedCategoryId={state.selectedCategoryId!}
      />
    </div>
  )
}

export default ManageCategories
