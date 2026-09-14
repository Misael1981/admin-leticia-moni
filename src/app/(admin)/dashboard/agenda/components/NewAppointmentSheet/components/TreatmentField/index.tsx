"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateAppointmentInput } from "@/schemas/appointment.schema"
import { Control, Controller, ControllerRenderProps } from "react-hook-form"

type TreatmentFieldProps = {
  control: Control<CreateAppointmentInput>
  setValue: (
    name: "treatmentId" | "endTime",
    value: string | Date,
    options?: { shouldValidate?: boolean },
  ) => void
  getValues: (name: "startTime") => Date | null | undefined
  treatments: { id: string; name: string; defaultDurationMinutes: number }[]
  error?: string
}

const TreatmentField = ({
  control,
  setValue,
  getValues,
  treatments,
  error,
}: TreatmentFieldProps) => {
  const handleTreatmentChange = (treatmentId: string) => {
    setValue("treatmentId", treatmentId)

    const selectedTreatment = treatments.find((t) => t.id === treatmentId)
    if (!selectedTreatment) return

    const currentStart = getValues("startTime") as Date | null | undefined
    if (!currentStart) return

    const newEnd = new Date(
      new Date(currentStart).getTime() +
        selectedTreatment.defaultDurationMinutes * 60000,
    )

    setValue("endTime", newEnd)
  }

  return (
    <Field>
      <FieldLabel>Tratamento / Procedimento</FieldLabel>
      <Controller
        name="treatmentId"
        control={control}
        render={({
          field,
        }: {
          field: ControllerRenderProps<CreateAppointmentInput, "treatmentId">
        }) => (
          <Select
            value={field.value}
            onValueChange={(val) => {
              handleTreatmentChange(val)
              setValue("treatmentId", val, { shouldValidate: true })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o procedimento" />
            </SelectTrigger>

            <SelectContent>
              {treatments.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name} ({t.defaultDurationMinutes} min)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <span className="text-destructive text-xs">{error}</span>}
    </Field>
  )
}

export default TreatmentField
