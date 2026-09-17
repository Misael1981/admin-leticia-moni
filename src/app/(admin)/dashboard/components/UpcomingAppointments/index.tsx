"use client"

import { getUpcomingAppointments } from "@/app/action/get-upcoming-appointments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type SuccessfulResult = Extract<
  Awaited<ReturnType<typeof getUpcomingAppointments>>,
  { success: true }
>

type UpcomingAppointmentItem = SuccessfulResult["data"][number]

type UpcomingAppointmentsProps = {
  appointments: UpcomingAppointmentItem[]
}

const UpcomingAppointments = ({ appointments }: UpcomingAppointmentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Próximos atendimentos
        </CardTitle>
      </CardHeader>

      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            Nenhum atendimento pendente para hoje.
          </p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((appt) => {
              const formattedTime = new Date(appt.startTime).toLocaleTimeString(
                "pt-BR",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )

              return (
                <Link
                  href={`/dashboard/pacientes/${appt.patient.id}`}
                  key={appt.id}
                >
                  <li className="hover:bg-muted/50 bg-background flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        {appt.patient.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {appt.treatment.name} • Sessão {appt.sessionNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-foreground text-sm font-semibold">
                        {formattedTime}
                      </span>
                    </div>
                  </li>
                </Link>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default UpcomingAppointments
