import PageHeader from "@/components/PageHeader"
import AddPatientButton from "./components/AddPatientButton"
import EmptyData from "@/components/EmptyData"
import { UserRound } from "lucide-react"
import CardPatient from "./components/CardPatient"
import { PatientStatus } from "@/constants/enums"
import PatientFilters from "./components/PatientFilters"
import { Suspense } from "react"
import PatientPagination from "./components/PatientPagination"
import { Prisma } from "@misael1981/physio-database"
import { getCountPatients, getPatients } from "@/data/patients.queries"

interface PatientsPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
    page?: string
  }>
}

const ITEMS_PER_PAGE = 10

export default async function PatientsPage({
  searchParams,
}: PatientsPageProps) {
  const params = await searchParams

  const currentStatus = params.status
  const searchQuery = params.search || ""
  const currentPage = Number(params.page) || 1

  const whereClause: Prisma.PatientWhereInput = {}

  if (currentStatus && currentStatus !== "TODOS") {
    whereClause.status = currentStatus as PatientStatus
  }

  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { cpf: { contains: searchQuery, mode: "insensitive" } },
    ]
  }

  const [patients, totalPatients] = await Promise.all([
    getPatients({ whereClause, currentPage, ITEMS_PER_PAGE }),
    getCountPatients({ whereClause }),
  ])

  const totalPages = Math.ceil(totalPatients / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Página dos Pacientes"
        description="Gerencie o cadastro dos pacientes, acompanhe a evolução dos tratamentos, acesse prontuários e mantenha todas as informações organizadas em um só lugar."
      />

      <AddPatientButton />

      <Suspense
        fallback={
          <div className="h-10 w-full animate-pulse rounded-md bg-slate-100" />
        }
      >
        <PatientFilters />
      </Suspense>

      <div>
        <p className="text-muted-foreground mb-4 text-sm">
          Mostrando {patients.length} de {totalPatients} pacientes encontrados.
        </p>

        {/* Loop temporário apenas para ver os dados chegando na tela */}
        <ul className="flex w-full flex-col items-center justify-center gap-4 divide-y">
          {patients.map((patient) => (
            <li key={patient.id} className="w-full max-w-4xl">
              <CardPatient patient={patient} />
            </li>
          ))}
          {patients.length === 0 && (
            <EmptyData
              icon={UserRound}
              title="Nenhum paciente cadastrado"
              description="Cadastre o primeiro paciente para começar a acompanhar avaliações,
        tratamentos e prontuários."
            />
          )}
        </ul>
      </div>

      <PatientPagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
