import PageHeader from "@/components/PageHeader"
import { getFinancialSummary } from "@/data/financial/get-values-month.querie"
import GridFinancialMetrics from "./components/GridFinancialMetrics"

export default async function FinancialPage() {
  const [metrics] = await Promise.all([getFinancialSummary()])
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Financeiro" />

      <GridFinancialMetrics metrics={metrics} />
    </div>
  )
}
