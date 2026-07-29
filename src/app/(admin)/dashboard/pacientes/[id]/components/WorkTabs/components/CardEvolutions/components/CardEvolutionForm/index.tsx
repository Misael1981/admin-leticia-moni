"use client"

import {
  EvolutionFormInput,
  EvolutionFormValues,
  evolutionSchema,
} from "@/schemas/patients-schemas"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { Badge } from "@/components/ui/badge"
import { PatientStatus } from "@/constants/enums"
import { NotebookPen } from "lucide-react"
import SessionEvolutionData from "../SessionEvolutionData"
import SessionNotes from "../SessionNotes"
import SessionWorkoutSelector from "../SessionWorkoutSelector"

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
      painScore: undefined,
      notes: "",

      patientStatus: currentPatientStatus ?? PatientStatus.ACTIVE,
    },
  })

  const {
    handleSubmit,
    formState: { isDirty },
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-heading text-foreground text-xl">Criar Sessão</h3>

          <Badge variant="outline" className="gap-1 px-4 py-3">
            <NotebookPen className="size-3" />
            Sessão #{nextSessionNumber}
          </Badge>
        </div>

        <div className="space-y-4">
          <SessionEvolutionData />

          <SessionWorkoutSelector />

          <SessionNotes />
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
      </form>
    </FormProvider>
  )
}

export default CardEvolutionForm
