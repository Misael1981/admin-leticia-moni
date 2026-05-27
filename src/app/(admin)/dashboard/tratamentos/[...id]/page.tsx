// app/dashboard/tratamentos/[...id]/page.tsx
import { db } from "@/lib/prisma"
import TreatmentForm from "./components/TreatmentForm"

interface TreatmentPageProps {
  params: Promise<{
    id: string[] // Agora o Next garante que o array existe se entrou aqui
  }>
}

export default async function TreatmentFormPage({
  params,
}: TreatmentPageProps) {
  const resolvedParams = await params
  const routeParam = resolvedParams.id[0]

  const isEditMode = routeParam !== "novo"

  let treatmentData = null

  if (isEditMode) {
    treatmentData = await db.treatment.findUnique({
      where: { id: routeParam },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
      },
    })
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold">
        {isEditMode ? "Editar Tratamento" : "Cadastrar Novo Tratamento"}
      </h1>

      <TreatmentForm treatment={treatmentData} />
    </div>
  )
}
