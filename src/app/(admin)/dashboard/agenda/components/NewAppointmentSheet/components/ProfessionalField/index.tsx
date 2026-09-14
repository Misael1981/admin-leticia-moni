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

type ProfessionalFieldProps = {
  control: Control<CreateAppointmentInput>
  setValue: (
    name: "physiotherapistId",
    value: string,
    options?: { shouldValidate?: boolean },
  ) => void
  physiotherapists: { id: string; name: string }[]
  error?: string
}

const ProfessionalField = ({
  control,
  setValue,
  physiotherapists,
  error,
}: ProfessionalFieldProps) => {
  const handlePhysiotherapistChange = (physiotherapistId: string) => {
    setValue("physiotherapistId", physiotherapistId)
  }

  return (
    <Field>
      <FieldLabel>Profissional</FieldLabel>
      <Controller
        name="physiotherapistId"
        control={control}
        render={({
          field,
        }: {
          field: ControllerRenderProps<
            CreateAppointmentInput,
            "physiotherapistId"
          >
        }) => (
          <Select
            value={field.value}
            onValueChange={(val) => {
              handlePhysiotherapistChange(val)
              setValue("physiotherapistId", val, {
                shouldValidate: true,
              })
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o profissional" />
            </SelectTrigger>

            <SelectContent>
              {physiotherapists.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
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

export default ProfessionalField
