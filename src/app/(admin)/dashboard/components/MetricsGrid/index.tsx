import CardsMetrics from "@/components/CardsMetrics"
import { CalendarCheck, ShoppingBasket, UserCheck, Users } from "lucide-react"

type MetricItem = {
  value: number
  trend: "up" | "down" | "neutral"
  trendValue: string
}

type MetricsGridProps = {
  metrics: {
    totalPatients: MetricItem
    activePatients: MetricItem
    quantityProducts: MetricItem
    evolutionsMonth: MetricItem
  }
}

const MetricsGrid = ({ metrics }: MetricsGridProps) => {
  const metricsData = [
    {
      id: 1,
      title: "Total de pacientes",
      value: metrics.totalPatients.value,
      trend: metrics.totalPatients.trend,
      trendValue: metrics.totalPatients.trendValue,
      icon: <Users size={18} />,
    },
    {
      id: 2,
      title: "Atendimentos do mês",
      value: metrics.evolutionsMonth.value,
      trend: metrics.evolutionsMonth.trend,
      trendValue: metrics.evolutionsMonth.trendValue,
      icon: <CalendarCheck size={18} />,
    },
    {
      id: 3,
      title: "Pacientes ativos",
      value: metrics.activePatients.value,
      trend: metrics.activePatients.trend,
      trendValue: metrics.activePatients.trendValue,
      icon: <UserCheck size={18} />,
    },
    {
      id: 4,
      title: "Produtos disponíveis",
      value: metrics.quantityProducts.value,
      trend: metrics.quantityProducts.trend,
      trendValue: metrics.quantityProducts.trendValue,
      icon: <ShoppingBasket size={18} />,
    },
  ] as const

  return (
    <section className="flex flex-wrap items-center justify-center gap-4">
      {metricsData.map((metric) => (
        <CardsMetrics key={metric.id} metric={metric} icon={metric.icon} />
      ))}
    </section>
  )
}

export default MetricsGrid
