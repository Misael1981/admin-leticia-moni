"use client"

import { getAppointmentBySelectedDate } from "@/app/action/get-appointments"
import { updateAppointmentStatus } from "@/app/action/update-appointment-status"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { APPOINTMENT_STATUS_OPTIONS } from "@/constants/options"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

type AppointmentItem = NonNullable<
  Awaited<ReturnType<typeof getAppointmentBySelectedDate>>["data"]
>[number]

type DialogStatusAppointmentProps = {
  appointment: AppointmentItem
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const DialogStatusAppointment = ({
  appointment,
  isOpen,
  onOpenChange,
}: DialogStatusAppointmentProps) => {
  const [selectedStatus, setSelectedStatus] = useState(appointment.status)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!isOpen) return

    const raf = requestAnimationFrame(() => {
      setSelectedStatus(appointment.status)
    })

    return () => cancelAnimationFrame(raf)
  }, [isOpen, appointment.status])

  const handleConfirm = () => {
    startTransition(async () => {
      const response = await updateAppointmentStatus({
        id: appointment.id,
        status: selectedStatus,
      })

      if (response.success) {
        toast.success(response.message)
        onOpenChange(false) // Fecha a modal
      } else {
        toast.error(response.error)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{appointment.patient.name}</DialogTitle>
          <DialogDescription>Alterar Status da Consulta</DialogDescription>
        </DialogHeader>

        <RadioGroup
          value={selectedStatus}
          onValueChange={(value: string) =>
            setSelectedStatus(value as AppointmentItem["status"])
          }
          className="max-w-sm space-y-2"
        >
          {APPOINTMENT_STATUS_OPTIONS.map((status) => (
            <FieldLabel
              key={status.value}
              htmlFor={status.value}
              className="cursor-pointer"
            >
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{status.label}</FieldTitle>
                </FieldContent>

                <RadioGroupItem value={status.value} id={status.value} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Voltar
          </Button>
          <Button
            variant="default" // mudei de destructive para default (ficando alinhado com acao de confirmacao)
            onClick={handleConfirm}
            disabled={isPending || selectedStatus === appointment.status}
          >
            {isPending ? "Salvando..." : "Confirmar Mudança"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogStatusAppointment
