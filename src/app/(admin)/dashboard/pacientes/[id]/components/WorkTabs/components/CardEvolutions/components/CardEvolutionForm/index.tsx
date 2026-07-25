"use client"

import "react-quill-new/dist/quill.snow.css"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
})

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  EvolutionFormInput,
  EvolutionFormValues,
  evolutionSchema,
} from "@/schemas/patients-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar1Icon, NotebookPen } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { getPainDescription } from "@/helpers/get-pain-description"
import { PatientStatus } from "@/constants/enums"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PATIENT_STATUS_OPTIONS } from "@/constants/options"

type CardEvolutionFormProps = {
  patientId: string
  lastSessionNumber: number
  currentPatientStatus: PatientStatus
}

const CardEvolutionForm = ({
  patientId,
  lastSessionNumber,
  currentPatientStatus,
}: CardEvolutionFormProps) => {
  const [isPending, startTransition] = useTransition()
  const nextSessionNumber = lastSessionNumber + 1

  const methods = useForm<EvolutionFormInput, unknown, EvolutionFormValues>({
    resolver: zodResolver(evolutionSchema),
    defaultValues: {
      sessionDate: new Date(),
      painScore: undefined, // Sem nota de dor selecionada por padrão
      notes: "", // Editor de texto limpo

      patientStatus: currentPatientStatus ?? PatientStatus.ACTIVE,
    },
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = methods

  const onSubmit = async (data: EvolutionFormValues) => {
    startTransition(async () => {
      try {
        console.log(data, patientId)
      } catch (error) {
        console.error("Erro ao criar sessão:", error)
      }
    })
  }

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <FieldGroup>
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-foreground text-xl">Criar Sessão</h3>

          <Badge variant="outline" className="gap-1 px-4 py-3">
            <NotebookPen className="size-3" />
            Sessão #{nextSessionNumber}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center md:justify-end">
            <Field className="w-full max-w-3xs">
              <FieldLabel>Data da Sessão</FieldLabel>

              <Controller
                name="sessionDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
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
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
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

          <div className="flex min-h-20 w-full items-center justify-center border p-4">
            <div className="space-y-2 text-center">
              <h3 className="font-heading text-foreground text-xl">
                Aqui o seletor de exercício (vídeos)
              </h3>

              <p>
                Preciso que me passe se acha necessário enviar mais alguma
                informação, tipo os espaçamento de tempo entre um exercício e
                outro, o tempo que o paciente ( minutos ) que cada exercício
                deve durar.
              </p>
              <p>
                Assim que vc criar a sessão, os exercícios serão atualizados no
                app do paciente e o celular receberá uma notificação, tipo
                quando chega msn do whats...
              </p>
            </div>
          </div>

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
        </div>

        <div className="flex w-full justify-center">
          <Button
            className="w-full max-w-xl"
            type="submit"
            size="lg"
            disabled={isPending || !isDirty}
          >
            {isPending ? "Criando Sessão..." : "Criar Sessão"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}

export default CardEvolutionForm
