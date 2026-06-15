"use client"

import { CategoryDTO } from "@/dtos/categories.dto"
import CategoriesMenu from "../CategoriesMenu"
import { useReducer } from "react"
import { catalogReducer } from "@/reducers/menuReducer"

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

  return (
    <div>
      <CategoriesMenu
        categories={state.categories}
        selectedCategoryId={state.selectedCategoryId}
        onselectCategory={handleSelectCategory}
      />
    </div>
  )
}

export default ManageCategories
