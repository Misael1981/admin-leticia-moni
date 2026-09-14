"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { CreateAppointmentInput } from "@/schemas/appointment.schema"
import { Control, Controller } from "react-hook-form"

type NotesFieldProps = {
  control: Control<CreateAppointmentInput>
  error?: string
}

const NotesField = ({ control, error }: NotesFieldProps) => {
  return (
    <Field>
      <FieldLabel>Observações</FieldLabel>
      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <Textarea
            placeholder="Alguma restrição ou recado para a recepção..."
            className="resize-none"
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
      {error && <span className="text-destructive text-xs">{error}</span>}
    </Field>
  )
}

export default NotesField
