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
          <div className="overflow-hidden rounded-lg border [&_.ql-editor]:max-h-125 [&_.ql-editor]:min-h-62 [&_.ql-editor]:overflow-y-auto">
            <ReactQuill
              theme="snow"
              value={field.value}
              onChange={field.onChange}
            />
          </div>
        )}
      />
      <FieldError>{errors.notes?.message}</FieldError>
    </Field>
  )
}

export default SessionNotes
