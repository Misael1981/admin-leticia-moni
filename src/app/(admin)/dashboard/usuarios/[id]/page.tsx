import PageHeader from "@/components/PageHeader"
import UserFormEdit from "./components/UserFormEdit"
import { getUserById } from "@/data/get-users-queries"

interface EditUserProps {
  params: Promise<{ id: string }>
}

export default async function EditUserProfilePage({ params }: EditUserProps) {
  const { id } = await params

  const user = await getUserById(id)

  return (
    <div className="space-y-6">
      <PageHeader title="Editar Cadastro do Usuário" />

      <UserFormEdit user={user} />
    </div>
  )
}
