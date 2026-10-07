import PageHeader from "@/components/PageHeader"
import { getFinancialSummary } from "@/data/financial/get-values-month.querie"
import { ChargeStatus } from "@misael1981/physio-database"
import GridFinancialMetrics from "./components/GridFinancialMetrics"
import PerSessionPayments from "./components/PerSessionPayments"
import { getChargeItemPerSession } from "@/data/financial/get-charge-item-per-session"
import AccumulatedPayments from "./components/AccumulatedPayments"
import { getAccumulatedOpenItems } from "@/data/financial/get-charge-accumulated"

export default async function FinancialPage() {
  const [metrics, chargeItemPerSession, chargeItemsAccumulated] =
    await Promise.all([
      getFinancialSummary(),
      getChargeItemPerSession(),
      getAccumulatedOpenItems(),
    ])

  const unpaidSessions = chargeItemPerSession.filter(
    (session) => session.charge?.status !== ChargeStatus.PAID,
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Financeiro" />

      <GridFinancialMetrics metrics={metrics} />

      <PerSessionPayments unpaidSessions={unpaidSessions} />

      <AccumulatedPayments unpaidItems={chargeItemsAccumulated} />
    </div>
  )
}
