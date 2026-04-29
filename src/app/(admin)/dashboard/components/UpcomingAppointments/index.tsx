"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Appointment = {
  id: number
  patientName: string
  time: string
}

type UpcomingAppointmentsProps = {
  appointments: Appointment[]
}

const UpcomingAppointments = ({ appointments }: UpcomingAppointmentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Próximos atendimentos</CardTitle>
      </CardHeader>

      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum atendimento agendado para hoje
          </p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-all"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {appt.patientName}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Atendimento agendado
                  </span>
                </div>

                <span className="text-sm font-semibold">{appt.time}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default UpcomingAppointments
