"use client"

import "react-quill-new/dist/quill.snow.css"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
})

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { EvolutionFormValues } from "@/schemas/patients-schemas"
import { Controller, useFormContext } from "react-hook-form"

const SessionNotes = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<EvolutionFormValues>()

  return (
    <Field>
      <FieldLabel>Notas</FieldLabel>
      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <div className="overflow-hidden rounded-lg border">
            <ReactQuill
              theme="snow"
              value={field.value}
              onChange={field.onChange}
              className="min-h-60"
            />
          </div>
        )}
      />
      <FieldError>{errors.notes?.message}</FieldError>
    </Field>
  )
}

export default SessionNotes
