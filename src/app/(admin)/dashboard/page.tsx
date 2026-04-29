import CardsMetrics from "@/components/CardsMetrics"
import PageHeader from "@/components/PageHeader"
import { CalendarCheck, ShoppingBasket, UserCheck, Users } from "lucide-react"
import QuickActions from "./components/QuickActions"

const metrics = [
  {
    id: 1,
    title: "Total de pacientes",
    value: 12,
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
      </div>
    </div>
  )
}
