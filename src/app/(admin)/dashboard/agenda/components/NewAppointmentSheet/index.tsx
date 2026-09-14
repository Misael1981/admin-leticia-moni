"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  CreateAppointmentInput,
  createAppointmentSchema,
} from "@/schemas/appointment.schema"
import { FieldGroup } from "@/components/ui/field"
import PatientField from "./components/PatientField"
import TreatmentField from "./components/TreatmentField"
import ProfessionalField from "./components/ProfessionalField"
import ScheduleField from "./components/ScheduleField"
import SessionNumberField from "./components/SessionNumberField"
import NotesField from "./components/NotesField"

interface NewAppointmentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
  patients: { id: string; name: string }[]
  physiotherapists: { id: string; name: string }[]
  treatments: { id: string; name: string; defaultDurationMinutes: number }[]
  clinicId: string
  onSubmitSuccess?: (data: CreateAppointmentInput) => void
}

export default function NewAppointmentSheet({
  open,
  onOpenChange,
  selectedDate = new Date(),
  patients,
  physiotherapists,
  treatments,
  clinicId,
  onSubmitSuccess,
}: NewAppointmentSheetProps) {
  const methods = useForm<CreateAppointmentInput>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      clinicId,
      patientId: "",
      physiotherapistId: "",
      treatmentId: "",
      startTime: new Date(new Date(selectedDate).setHours(9, 0, 0, 0)),
      endTime: new Date(new Date(selectedDate).setHours(9, 50, 0, 0)),
      status: "SCHEDULED",
      sessionNumber: undefined,
      notes: "",
    },
  })

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = methods

  // Sincroniza o horário
  useEffect(() => {
    if (open) {
      const baseStart = new Date(selectedDate)
      baseStart.setHours(9, 0, 0, 0)
      const baseEnd = new Date(selectedDate)
      baseEnd.setHours(9, 50, 0, 0)

      setValue("startTime", baseStart)
      setValue("endTime", baseEnd)
    }
  }, [open, selectedDate, setValue])

  async function onSubmit(data: CreateAppointmentInput) {
    try {
      console.log("Novo Agendamento enviado:", data)
      onSubmitSuccess?.(data)
      onOpenChange(false)
      reset()
    } catch (error) {
      console.error("Erro ao agendar:", error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Novo Agendamento</SheetTitle>
          <SheetDescription>
            Agendamento rápido no estilo timeline. Preencha os dados abaixo.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <FieldGroup className="grid grid-cols-1 gap-4">
            {/* 1. PACIENTE */}
            <PatientField
              control={control}
              error={errors.patientId?.message}
              patients={patients}
              setValue={setValue}
            />

            {/* 2. TRATAMENTO */}
            <TreatmentField
              control={control}
              setValue={setValue}
              getValues={getValues}
              treatments={treatments}
              error={errors.treatmentId?.message}
            />

            {/* 3. PROFISSIONAL */}
            <ProfessionalField
              control={control}
              setValue={setValue}
              physiotherapists={physiotherapists}
              error={errors.physiotherapistId?.message}
            />

            {/* 4. HORÁRIOS */}
            <ScheduleField
              control={control}
              error={errors.startTime?.message || errors.endTime?.message}
            />

            {/* 5. NÚMERO DA SESSÃO */}
            <SessionNumberField
              control={control}
              error={errors.sessionNumber?.message}
            />

            {/* 6. OBSERVAÇÕES */}
            <NotesField control={control} error={errors.notes?.message} />
          </FieldGroup>

          <SheetFooter className="pt-4">
            <Button type="submit" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Confirmar Agendamento
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
