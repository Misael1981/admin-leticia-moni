import { getProductById } from "@/data/get-product-by-id"
import ProductForm from "./components/ProductForm"

interface ProductFormPageProps {
  params: Promise<{
    id: string[]
  }>

  searchParams: Promise<{
    groupId?: string
  }>
}

export default async function ProductFormPage({
  params,
  searchParams,
}: ProductFormPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  const routeParam = resolvedParams.id[0]
  const isEditMode = routeParam !== "novo"

  const querygroupId = resolvedSearchParams.groupId
  const product = isEditMode ? await getProductById({ id: routeParam }) : null

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isEditMode ? "Editar Produto" : "Cadastrar Novo Produto"}
      </h1>

      <ProductForm
        product={product}
        defaultGroupId={isEditMode ? product?.groupId : querygroupId}
      />
    </div>
  )
}
