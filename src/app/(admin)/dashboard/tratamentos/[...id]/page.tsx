import TreatmentForm from "./components/TreatmentForm"
import { getTreatmentData } from "@/data/get-treatmen-data"

interface TreatmentPageProps {
  params: Promise<{
    id: string[]
  }>
}

export default async function TreatmentFormPage({
  params,
}: TreatmentPageProps) {
  const resolvedParams = await params
  const routeParam = resolvedParams.id[0]

  const isEditMode = routeParam !== "novo"

  const treatmentData = isEditMode
    ? await getTreatmentData({ treatmentId: routeParam })
    : null

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isEditMode ? "Editar Tratamento" : "Cadastrar Novo Tratamento"}
      </h1>

      <TreatmentForm treatment={treatmentData} />
    </div>
  )
}
