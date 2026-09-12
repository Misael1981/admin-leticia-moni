import PageHeader from "@/components/PageHeader"
import AppointmentCalendar from "./components/AppointmentCalendar"

export default async function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gerencie seus Agendamentos" />

      <AppointmentCalendar />
    </div>
  )
}
