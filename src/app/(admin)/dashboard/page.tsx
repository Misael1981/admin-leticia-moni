import CardsMetrics from "@/components/CardsMetrics"
import PageHeader from "@/components/PageHeader"
import { CalendarCheck, ShoppingBasket, UserCheck, Users } from "lucide-react"
import QuickActions from "./components/QuickActions"
import UpcomingAppointments from "./components/UpcomingAppointments"
import RecentPatients from "./components/RecentPatients"
import RecentActivity from "./components/RecentActivity"

const metrics = [
  {
    id: 1,
    title: "Total de pacientes",
    value: 85,
    trend: "up",
    trendValue: "10%",
  },
  {
    id: 2,
    title: "Atendimentos do mês",
    value: 25,
    trend: "down",
    trendValue: "5%",
  },
  {
    id: 3,
    title: "Pacientes ativos",
    value: 50,
    trend: "up",
    trendValue: "15%",
  },
  {
    id: 4,
    title: "Produtos disponíveis",
    value: 25,
    trend: "down",
    trendValue: "8%",
  },
] as const

const getIcon = (id: number) => {
  switch (id) {
    case 1:
      return <Users size={18} />
    case 2:
      return <CalendarCheck size={18} />
    case 3:
      return <UserCheck size={18} />
    case 4:
      return <ShoppingBasket size={18} />
    default:
      return null
  }
}

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

const patients = [
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

export default function DashboardPage() {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Visão Geral"
        description="Resumo de pacientes, tratamentos e uma visão geral do seu estabelecimento."
      />
      <div className="space-y-6 p-8">
        <section className="flex flex-wrap items-center justify-center gap-4">
          {metrics.map((metric) => (
            <CardsMetrics
              key={metric.id}
              metric={metric}
              icon={getIcon(metric.id)}
            />
          ))}
        </section>

        <QuickActions />

        <UpcomingAppointments appointments={appointments} />

        <RecentPatients patients={patients} />

        <RecentActivity activities={activities} />
      </div>
    </div>
  )
}
