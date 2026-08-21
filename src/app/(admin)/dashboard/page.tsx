import PageHeader from "@/components/PageHeader"
import QuickActions from "./components/QuickActions"
import UpcomingAppointments from "./components/UpcomingAppointments"
import RecentPatients from "./components/RecentPatients"
import RecentActivity from "./components/RecentActivity"
import MetricsGrid from "./components/MetricsGrid"
import {
  getMetricsOverview,
  getRecentPatientsFromEvolutions,
} from "@/data/get-overview-data"
import { appointments } from "@/constants/mocks"

const activities = [
  {
    id: 1,
    description: "Exercício enviado para João",
    createdAt: "2026-04-29T10:00:00",
  },
  {
    id: 2,
    description: "Paciente Maria cadastrado",
    createdAt: "2026-04-29T08:30:00",
  },
  {
    id: 3,
    description: "Atendimento registrado",
    createdAt: "2026-04-28T17:00:00",
  },
]

export default async function DashboardPage() {
  const [metrics, evolutions] = await Promise.all([
    getMetricsOverview(),
    getRecentPatientsFromEvolutions(),
  ])

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Visão Geral"
        description="Resumo de pacientes, tratamentos e uma visão geral do seu estabelecimento."
      />
      <div className="space-y-6 p-8">
        <MetricsGrid metrics={metrics} />

        <QuickActions />

        <UpcomingAppointments appointments={appointments} />

        <RecentPatients patients={evolutions} />

        <RecentActivity activities={activities} />
      </div>
    </div>
  )
}
