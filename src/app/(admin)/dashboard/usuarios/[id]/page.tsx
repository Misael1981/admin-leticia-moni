import PageHeader from "@/components/PageHeader"

interface EditUserProps {
  params: Promise<{ id: string }>
}

export default async function EditUserProfilePage({ params }: EditUserProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <PageHeader title="Editar Cadastro do Usuário" />
    </div>
  )
}
