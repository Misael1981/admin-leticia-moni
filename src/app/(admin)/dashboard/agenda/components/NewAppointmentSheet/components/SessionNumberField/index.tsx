"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CreateAppointmentInput } from "@/schemas/appointment.schema"
import { Control, Controller } from "react-hook-form"

type SessionNumberFieldProps = {
  control: Control<CreateAppointmentInput>
  error?: string
}

const SessionNumberField = ({ control, error }: SessionNumberFieldProps) => {
  return (
    <Field>
      <FieldLabel>Nº da Sessão (Opcional)</FieldLabel>
      <Controller
        name="sessionNumber"
        control={control}
        render={({ field }) => (
          <Input
            type="number"
            placeholder="Ex: 3"
            value={field.value == null ? "" : String(field.value)}
            onChange={(e) =>
              field.onChange(
                e.target.value === "" ? undefined : Number(e.target.value),
              )
            }
          />
        )}
      />
      {error && <span className="text-destructive text-xs">{error}</span>}
    </Field>
  )
}

export default SessionNumberField
