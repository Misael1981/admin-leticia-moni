import PageHeader from "@/components/PageHeader"
import QuickActions from "./components/QuickActions"
import UpcomingAppointments from "./components/UpcomingAppointments"
import RecentPatients from "./components/RecentPatients"
import MetricsGrid from "./components/MetricsGrid"
import {
  getMetricsOverview,
  getMonthBirthdayPatients,
  getRecentPatientsFromEvolutions,
} from "@/data/get-overview-data"
import { appointments } from "@/constants/mocks"
import BirthdayPatientsList from "./components/BirthdayPatientsList"

export default async function DashboardPage() {
  const [metrics, evolutions, monthBirthdays] = await Promise.all([
    getMetricsOverview(),
    getRecentPatientsFromEvolutions(),
    getMonthBirthdayPatients(),
  ])

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Visão Geral"
        description="Resumo de pacientes, tratamentos e uma visão geral do seu estabelecimento."
      />
      <div className="space-y-6 p-8">
        <MetricsGrid metrics={metrics} />

        <BirthdayPatientsList patients={monthBirthdays} />

        <QuickActions />

        <UpcomingAppointments appointments={appointments} />

        <RecentPatients patients={evolutions} />
      </div>
    </div>
  )
}
