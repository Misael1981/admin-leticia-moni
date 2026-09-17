"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CreateAppointmentInput } from "@/schemas/appointment.schema"
import { Control, Controller } from "react-hook-form"

type ScheduleFieldProps = {
  control: Control<CreateAppointmentInput>
  error?: string
  setValue: (
    name: "startTime" | "endTime",
    value: Date | Date,
    options?: { shouldValidate?: boolean },
  ) => void
}

const ScheduleField = ({ control, error, setValue }: ScheduleFieldProps) => {
  const formatDateTimeLocalValue = (date: Date | null | undefined) => {
    if (!date || Number.isNaN(date.getTime())) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const parseDateTimeLocalString = (value: string): Date | null => {
    if (!value) return null
    const [datePart, timePart] = value.split("T")
    if (!datePart || !timePart) return null
    const [year, month, day] = datePart.split("-").map(Number)
    const [hours, minutes] = timePart.split(":").map(Number)
    return new Date(year, month - 1, day, hours, minutes)
  }

  const getDateFieldValue = (value: unknown) => {
    if (value instanceof Date) return value
    if (typeof value === "string") return new Date(value)
    return null
  }

  return (
    <div className="flex flex-col items-center gap-3 md:flex-row">
      <Field className="w-fit">
        <FieldLabel>Início</FieldLabel>
        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <Input
              type="datetime-local"
              value={formatDateTimeLocalValue(getDateFieldValue(field.value))}
              onChange={(e) => {
                const newStart = parseDateTimeLocalString(e.target.value)
                field.onChange(newStart)

                if (!newStart) return

                const currentEnd = getDateFieldValue(
                  control._formValues.endTime,
                )

                if (!currentEnd || Number.isNaN(currentEnd.getTime())) {
                  setValue("endTime", newStart, { shouldValidate: true })
                  return
                }

                const syncedEnd = new Date(
                  newStart.getFullYear(),
                  newStart.getMonth(),
                  newStart.getDate(),
                  currentEnd.getHours(),
                  currentEnd.getMinutes(),
                )

                setValue("endTime", syncedEnd, { shouldValidate: true })
              }}
            />
          )}
        />
        {error && <span className="text-destructive text-xs">{error}</span>}
      </Field>

      <Field className="w-fit">
        <FieldLabel>Término</FieldLabel>
        <Controller
          name="endTime"
          control={control}
          render={({ field }) => (
            <Input
              type="datetime-local"
              value={formatDateTimeLocalValue(getDateFieldValue(field.value))}
              onChange={(e) =>
                field.onChange(parseDateTimeLocalString(e.target.value))
              }
            />
          )}
        />
        {error && <span className="text-destructive text-xs">{error}</span>}
      </Field>
    </div>
  )
}

export default ScheduleField
