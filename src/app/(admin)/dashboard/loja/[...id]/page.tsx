import { getProductById } from "@/data/get-product-by-id"
import ProductForm from "./components/ProductForm"

interface ProductFormPageProps {
  params: Promise<{
    id: string[]
  }>
}

export default async function ProductFormPage({
  params,
}: ProductFormPageProps) {
  const resolvedParams = await params
  const routeParam = resolvedParams.id[0]

  const isEditMode = routeParam !== "novo"

  const product = isEditMode ? await getProductById({ id: routeParam }) : null

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isEditMode ? "Editar Produto" : "Cadastrar Novo Produto"}
      </h1>

      <ProductForm product={product} />
    </div>
  )
}
