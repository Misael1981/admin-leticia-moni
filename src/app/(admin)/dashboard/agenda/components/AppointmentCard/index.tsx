"use client"

import { getAppointmentBySelectedDate } from "@/app/action/get-appointments"
import { APPOINTMENT_STATUS_CONFIG } from "@/constants/config"
import { useState } from "react"
import DialogStatusAppointment from "../DialogStatusAppointment"

type AppointmentItem = NonNullable<
  Awaited<ReturnType<typeof getAppointmentBySelectedDate>>["data"]
>[number]

interface AppointmentCardProps {
  appointment: AppointmentItem
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false)

  const handleOpenDialog = () => {
    setIsOpenDialog(true)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpenDialog(open)
  }

  const formattedTime = new Date(appointment.startTime).toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  )

  const statusInfo = APPOINTMENT_STATUS_CONFIG[appointment.status]

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        className={`w-full cursor-pointer space-y-4 rounded-lg border border-l-4 p-3 text-left transition-colors ${statusInfo.borderStyle} ${statusInfo.bgStyle}`}
      >
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="text-muted-foreground w-16 text-sm font-bold">
            {formattedTime}
          </div>
          <div className="flex-1">
            <p className="text-foreground font-semibold">
              {appointment.patient.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {appointment.treatment.name} • Sessão {appointment.sessionNumber}
            </p>
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusInfo.badgeStyle}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {appointment.notes && (
          <p className="text-muted-foreground text-xs">{appointment.notes}</p>
        )}
      </button>
      <DialogStatusAppointment
        appointment={appointment}
        isOpen={isOpenDialog}
        onOpenChange={handleOpenChange}
      />
    </>
  )
}

export default AppointmentCard
