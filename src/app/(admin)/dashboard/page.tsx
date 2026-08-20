import PageHeader from "@/components/PageHeader"
import QuickActions from "./components/QuickActions"
import UpcomingAppointments from "./components/UpcomingAppointments"
import RecentPatients from "./components/RecentPatients"
import RecentActivity from "./components/RecentActivity"
import MetricsGrid from "./components/MetricsGrid"
import { getMetricsOverview } from "@/data/get-overview-data"

const appointments = [
  {
    id: 1,
    patientName: "Maria Silva",
    time: "08:00",
  },
  {
    id: 2,
    patientName: "João Souza",
    time: "09:30",
  },
  {
    id: 3,
    patientName: "Ana Costa",
    time: "11:00",
  },
]

const patientsFork = [
  {
    id: 1,
    name: "Maria Silva",
    createdAt: "2026-04-29",
  },
  {
    id: 2,
    name: "João Souza",
    createdAt: "2026-04-28",
  },
  {
    id: 3,
    name: "Ana Costa",
    createdAt: "2026-04-27",
  },
]

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
  const metrics = await getMetricsOverview()

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

        <RecentPatients patients={patientsFork} />

        <RecentActivity activities={activities} />
      </div>
    </div>
  )
}
