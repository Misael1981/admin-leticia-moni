import PageHeader from "@/components/PageHeader"
import EditProfilePatientForm from "./components/EditProfilePatientForm"
import { getPatientById } from "@/data/patients.queries"

interface EditProfilePage {
  params: Promise<{
    id: string
  }>
}

export default async function EditProfilePage({ params }: EditProfilePage) {
  const { id } = await params

  const patientData = await getPatientById({ id })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edite o Cadastro do Paciente"
        description="Atualize as informações cadastrais do paciente sempre que necessário. Mantenha dados pessoais, documentos, contatos e demais informações corretas para garantir um atendimento seguro, organizado e sempre atualizado."
      />

      <EditProfilePatientForm initialData={patientData} patientId={id} />
    </div>
  )
}
