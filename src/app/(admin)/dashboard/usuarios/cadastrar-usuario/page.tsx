import PageHeader from "@/components/PageHeader"
import UserFormRegister from "./components/UserFormRegister"

export default function RegisterUserPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Adicionar Usuário do Sistema"
        description="Cadastre novos usuários que terão acesso ao sistema da clínica. Defina cuidadosamente o perfil de acesso de cada usuário, pois as permissões disponíveis serão concedidas de acordo com a função exercida. Cada colaborador deve possuir apenas as permissões necessárias para desempenhar suas atividades, garantindo a segurança das informações dos pacientes e o correto funcionamento do sistema."
      />

      <UserFormRegister />
    </div>
  )
}
