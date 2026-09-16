"use client"

import { useEffect, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
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
import { createAppointmentAction } from "@/app/action/create-appointment"
import { toast } from "sonner"

interface NewAppointmentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate?: Date
  onSubmitSuccess?: (data: CreateAppointmentInput) => void
  clinicData: {
    patients: {
      id: string
      name: string
      evolution: {
        sessionNumber: number
      }[]
      treatments: {
        treatment: {
          id: string
          name: string
          sessionDurationMinutes: number | null
        }
      }[]
    }[]
    physiotherapists: {
      id: string
      name: string
    }[]
    treatments: {
      id: string
      name: string
      sessionDurationMinutes: number | null
    }[]
    id: string
  }
}

export default function NewAppointmentSheet({
  open,
  onOpenChange,
  selectedDate = new Date(),
  clinicData,
  onSubmitSuccess,
}: NewAppointmentSheetProps) {
  const [isPending, startTransition] = useTransition()

  const clinicId = clinicData.id
  const defaultPhysiotherapist =
    clinicData.physiotherapists.find((p) => p.name.includes("Leticia Moni"))
      ?.id ??
    clinicData.physiotherapists[0]?.id ??
    ""

  const methods = useForm<CreateAppointmentInput>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      clinicId,
      patientId: "",
      physiotherapistId: defaultPhysiotherapist,
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

  const selectedPatientId = useWatch({
    control,
    name: "patientId",
  })

  useEffect(() => {
    if (!selectedPatientId) {
      setValue("sessionNumber", undefined)
      setValue("treatmentId", "")
      return
    }

    const selectedPatient = clinicData.patients.find(
      (p) => p.id === selectedPatientId,
    )

    const totalEvolutions = selectedPatient?.evolution?.length ?? 0
    const nextSession = totalEvolutions + 1
    setValue("sessionNumber", nextSession, { shouldValidate: true })

    const firstActiveTreatment = selectedPatient?.treatments?.[0]?.treatment

    if (firstActiveTreatment?.id) {
      setValue("treatmentId", firstActiveTreatment.id, { shouldValidate: true })

      if (firstActiveTreatment.sessionDurationMinutes) {
        const currentStart = getValues("startTime") as Date | null | undefined
        if (currentStart) {
          const newEnd = new Date(
            new Date(currentStart).getTime() +
              firstActiveTreatment.sessionDurationMinutes * 60000,
          )
          setValue("endTime", newEnd)
        }
      }
    }
  }, [selectedPatientId, clinicData.patients, setValue, getValues])

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
    startTransition(async () => {
      try {
        const result = await createAppointmentAction(data)

        if (!result.success) {
          toast.error(result.error)
          console.log(result.error)
          return
        }

        toast.success("Consulta agendada com sucesso")
        onSubmitSuccess?.(data)
        onOpenChange(false)
        reset()
      } catch (error) {
        toast.error("Erro ao agendar consulta!")
        console.error("Erro ao agendar:", error)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto">
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
              patients={clinicData.patients}
              setValue={setValue}
            />

            {/* 2. TRATAMENTO */}
            <TreatmentField
              control={control}
              setValue={setValue}
              getValues={getValues}
              treatments={clinicData.treatments}
              error={errors.treatmentId?.message}
            />

            {/* 3. PROFISSIONAL */}
            <ProfessionalField
              control={control}
              setValue={setValue}
              physiotherapists={clinicData.physiotherapists}
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
            <Button type="submit" className="w-full gap-2" disabled={isPending}>
              <Plus className="h-4 w-4" />
              {isPending ? "Salvando..." : "Confirmar Agendamento"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
