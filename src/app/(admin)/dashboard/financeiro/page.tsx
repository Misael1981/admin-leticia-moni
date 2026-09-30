import PageHeader from "@/components/PageHeader"
import { getFinancialSummary } from "@/data/financial/get-values-month.querie"
import GridFinancialMetrics from "./components/GridFinancialMetrics"
import PerSessionPayments from "./components/PerSessionPayments"
import { getChargeItemPerSession } from "@/data/financial/get-charge-item-per-session"

export default async function FinancialPage() {
  const [metrics, chargeItemPerSession] = await Promise.all([
    getFinancialSummary(),
    getChargeItemPerSession(),
  ])

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Financeiro" />

      <GridFinancialMetrics metrics={metrics} />

      <PerSessionPayments unpaidSessions={chargeItemPerSession} />
    </div>
  )
}
