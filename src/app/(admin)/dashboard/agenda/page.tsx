import PageHeader from "@/components/PageHeader"
import AppointmentCalendar from "./components/AppointmentCalendar"
import { getClinicData } from "@/data/appointments.queries"

export default async function AppointmentsPage() {
  const clinicData = await getClinicData()

  return (
    <div className="space-y-6">
      <PageHeader title="Gerencie seus Agendamentos" />

      <AppointmentCalendar clinicData={clinicData} />
    </div>
  )
}
