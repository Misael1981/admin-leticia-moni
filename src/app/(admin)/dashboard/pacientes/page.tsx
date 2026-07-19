import PageHeader from "@/components/PageHeader"
import AddPatientButton from "./components/AddPatientButton"
import { getAllPatients } from "@/data/patients.queries"
import EmptyData from "@/components/EmptyData"
import { UserRound } from "lucide-react"

export default async function PatientsPage() {
  const patients = await getAllPatients()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Página dos Pacientes"
        description="Gerencie o cadastro dos pacientes, acompanhe a evolução dos tratamentos, acesse prontuários e mantenha todas as informações organizadas em um só lugar."
      />

      <AddPatientButton />

      <EmptyData
        icon={UserRound}
        title="Nenhum paciente cadastrado"
        description="Cadastre o primeiro paciente para começar a acompanhar avaliações,
        tratamentos e prontuários."
      />
    </div>
  )
}
