import { AlertTriangle, ArrowUpRight, Clock, DollarSign } from "lucide-react"
import { FinancialMetricCard } from "../FinancialMetricCard"

type GridFinancialMetricsProps = {
  metrics: {
    received: number
    pending: number
    overdue: number
    monthlyTotal: number
  }
}

const GridFinancialMetrics = ({ metrics }: GridFinancialMetricsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <FinancialMetricCard
        title="Faturamento Previsto"
        amount={metrics.monthlyTotal}
        icon={DollarSign}
        description="Previsto para o mês atual"
        variant="default"
      />

      <FinancialMetricCard
        title="Recebido"
        amount={metrics.received}
        icon={ArrowUpRight}
        description="Cobranças já liquidadas"
        variant="success"
      />

      <FinancialMetricCard
        title="A Receber"
        amount={metrics.pending}
        icon={Clock}
        description="A vencer até o fim do mês"
        variant="warning"
      />

      <FinancialMetricCard
        title="Em Atraso"
        amount={metrics.overdue}
        icon={AlertTriangle}
        description="Vencidos pendentes de pagamento"
        variant="danger"
      />
    </div>
  )
}

export default GridFinancialMetrics
