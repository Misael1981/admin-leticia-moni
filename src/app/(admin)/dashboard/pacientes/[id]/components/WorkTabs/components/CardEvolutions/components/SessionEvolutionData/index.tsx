"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar1Icon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { getPainDescription } from "@/helpers/get-pain-description"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PATIENT_STATUS_OPTIONS } from "@/constants/options"
import { Controller, useFormContext } from "react-hook-form"
import { EvolutionFormValues } from "@/schemas/patients-schemas"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"

const SessionEvolutionData = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<EvolutionFormValues>()

  return (
    <>
      <div className="flex justify-center md:justify-end">
        <Field className="w-full max-w-3xs">
          <FieldLabel>Data da Sessão</FieldLabel>

          <Controller
            name="sessionDate"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {field.value
                      ? format(field.value, "dd/MM/yyyy", { locale: ptBR })
                      : "Selecione a data"}

                    <Calendar1Icon className="opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
            )}
          />

          <FieldError>{errors.sessionDate?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <div className="flex justify-center">
          <FieldLabel>Nível de Dor (EVA)</FieldLabel>
        </div>

        <Controller
          name="painScore"
          control={control}
          render={({ field }) => (
            <ToggleGroup
              type="single"
              value={field.value?.toString()}
              className="justify-center"
              onValueChange={(value) => {
                field.onChange(value ? Number(value) : null)
              }}
            >
              <div>
                {Array.from({ length: 11 }, (_, i) => (
                  <ToggleGroupItem
                    key={i}
                    value={i.toString()}
                    aria-label={`EVA ${i}`}
                  >
                    {i}
                  </ToggleGroupItem>
                ))}

                <p className="text-muted-foreground mt-2 text-center text-sm">
                  {getPainDescription(Number(field.value))}
                </p>
              </div>
            </ToggleGroup>
          )}
        />

        <FieldError>{errors.painScore?.message}</FieldError>
      </Field>

      <div className="flex w-full justify-center">
        <Field className="w-full max-w-lg">
          <FieldLabel>Status</FieldLabel>
          <Controller
            name="patientStatus"
            control={control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PATIENT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.patientStatus?.message}</FieldError>
        </Field>
      </div>
    </>
  )
}

export default SessionEvolutionData
