"use client"

import { CategoryDTO } from "@/dtos/categories.dto"
import CategoriesMenu from "../CategoriesMenu"
import { useReducer } from "react"
import { catalogReducer } from "@/reducers/menuReducer"
import SelectedCategorieName from "../SelectedCategorieName"
import ProductsGroupSection from "../ProductsGroupSection"
import ProductsList from "../ProductsList"

type ManageCategoriesProps = {
  categories: CategoryDTO[]
}

const ManageCategories = ({ categories }: ManageCategoriesProps) => {
  const [state, dispatch] = useReducer(catalogReducer, {
    selectedCategoryId: categories[0]?.id ?? null,
    selectedGroupId: categories[0]?.productsGroup?.[0]?.id ?? null,
    selectedProductId: null,
  })

  const handleSelectCategory = (id: string) => {
    const nextCategory =
      categories.find((category) => category.id === id) ?? null

    dispatch({ type: "SELECT_CATEGORY", payload: id })
    dispatch({
      type: "SELECT_GROUP",
      payload: nextCategory?.productsGroup[0]?.id ?? null,
    })
  }

  const handleSelectGroup = (id: string) => {
    dispatch({ type: "SELECT_GROUP", payload: id })
  }

  const selectedCategory =
    categories.find((c) => c.id === state.selectedCategoryId) ?? null

  const selectGroup =
    selectedCategory?.productsGroup.find(
      (c) => c.id === state.selectedGroupId,
    ) ?? null

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <CategoriesMenu
        categories={categories}
        selectedCategoryId={state.selectedCategoryId}
        onselectCategory={handleSelectCategory}
      />

      <ProductsGroupSection
        categoryName={selectedCategory?.name ?? ""}
        selectedCategoryId={state.selectedCategoryId!}
        productGroup={selectedCategory?.productsGroup ?? []}
        selectedGroupId={state.selectedGroupId}
        onSelectGroup={handleSelectGroup}
      />

      <SelectedCategorieName
        categoryName={selectedCategory?.name ?? ""}
        groupName={selectGroup?.name ?? ""}
      />

      <ProductsList
        categoryName={selectedCategory?.name ?? ""}
        products={selectGroup?.products ?? []}
        groupId={state.selectedGroupId!}
      />
    </div>
  )
}

export default ManageCategories
