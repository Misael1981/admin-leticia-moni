import PageHeader from "@/components/PageHeader"

interface EditProfilePage {
  params: Promise<{
    id: string
  }>
}

export default async function EditProfilePage({ params }: EditProfilePage) {
  const id = await params

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edite o Cadastro do Paciente"
        description="Atualize as informações cadastrais do paciente sempre que necessário. Mantenha dados pessoais, documentos, contatos e demais informações corretas para garantir um atendimento seguro, organizado e sempre atualizado."
      />
    </div>
  )
}
