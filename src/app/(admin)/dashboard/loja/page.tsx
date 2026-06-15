import PageHeader from "@/components/PageHeader"
import ManageCategories from "./components/ManageCategories"
import { getCategoriesAndProducts } from "@/data/get-categories-and-products"

export default async function StorePage() {
  const categories = await getCategoriesAndProducts()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerencie seua loja"
        description="Gerencie os produtos em tabelas que você disponibilizará na plataforma."
      />

      <div className="flex justify-center p-4 lg:px-8">
        <ManageCategories categories={categories} />
      </div>
    </div>
  )
}
