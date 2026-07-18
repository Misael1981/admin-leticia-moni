import PageHeader from "@/components/PageHeader"
import RegisterPatientForm from "./components/RegisterPatientForm"

export default async function RegisterPatientPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cadastro de Paciente"
        description="Cadastre um novo paciente preenchendo as informações necessárias para iniciar o acompanhamento fisioterapêutico. Esses dados serão utilizados para identificar o paciente e organizar seu prontuário clínico."
      />

      <RegisterPatientForm />
    </div>
  )
}
