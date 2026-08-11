import PageHeader from "@/components/PageHeader"
import { getPatientAuth, getPatientById } from "@/data/patients.queries"
import { notFound } from "next/navigation"
import PatientAccessForm from "./components/PatientAccessForm"

interface AppAccessPageProps {
  params: Promise<{ id: string }>
}

export default async function AppAccessPage({ params }: AppAccessPageProps) {
  const { id } = await params

  const [patient, patientAuth] = await Promise.all([
    getPatientById({ id }),
    getPatientAuth(id),
  ])

  if (!patient) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gerenciar Acesso ao App do Paciente" />

      <PatientAccessForm patient={patient} patientAuth={patientAuth} />
    </div>
  )
}
