import PageHeader from "@/components/PageHeader"
import {
  getAnamnesisByPatientId,
  getEvolutionsByPatientId,
  getPatientById,
  getPhysicalAssessmentPatientId,
} from "@/data/patients.queries"
import { notFound } from "next/navigation"
import CardHero from "./components/CardHero"
import WorkTabs from "./components/WorkTabs"
import { getAllVideos } from "@/modules/videos/queries/get-videos.queries"

interface MedicalRecordProps {
  params: Promise<{ id: string }>
}

export default async function MedicalRecordPage({
  params,
}: MedicalRecordProps) {
  const { id } = await params

  const [patient, anamnesis, physicalAssessment, evolutions, videos] =
    await Promise.all([
      getPatientById({ id }),
      getAnamnesisByPatientId(id),
      getPhysicalAssessmentPatientId(id),
      getEvolutionsByPatientId(id),
      getAllVideos(),
    ])

  if (!patient) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciamento do Prontuário"
        description="Consulte todo o histórico clínico do paciente em um único lugar. Registre evoluções, tratamentos, avaliações, observações e acompanhe a evolução do atendimento de forma organizada, garantindo um acompanhamento completo durante todo o processo de reabilitação"
      />

      <CardHero patient={patient} />

      <WorkTabs
        patient={patient}
        anamnesis={anamnesis}
        physicalAssessment={physicalAssessment}
        evolutions={evolutions}
        currentPatientStatus={patient.status}
        videos={videos}
      />
    </div>
  )
}
