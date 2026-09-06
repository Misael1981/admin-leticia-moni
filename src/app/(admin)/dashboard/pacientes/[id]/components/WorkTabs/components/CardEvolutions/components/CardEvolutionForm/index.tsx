"use client"

import {
  EvolutionFormInput,
  evolutionFormSchema,
  EvolutionFormValues,
  EvolutionImage,
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
import { VideoType } from "@/modules/videos/queries/get-videos.queries"
import { createEvolutionAction } from "@/app/action/create-evolution.action"
import { toast } from "sonner"
import OptionalImageSession from "../OptionalImageSession"
import { uploadMultipleImages } from "@/services/image-compresseion.service"

type CardEvolutionFormProps = {
  patientId: string
  lastSessionNumber: number
  currentPatientStatus: PatientStatus
  videos: VideoType[] | null
}

const CardEvolutionForm = ({
  patientId,
  lastSessionNumber,
  currentPatientStatus,
  videos,
}: CardEvolutionFormProps) => {
  const [isPending, startTransition] = useTransition()
  const nextSessionNumber = lastSessionNumber + 1

  const methods = useForm<EvolutionFormInput, unknown, EvolutionFormValues>({
    resolver: zodResolver(evolutionFormSchema), // <- antes era evolutionSchema
    defaultValues: {
      sessionDate: new Date(),
      painScore: undefined,
      notes: "",
      patientStatus: currentPatientStatus ?? PatientStatus.ACTIVE,
      exerciseVideos: [],
      images: [],
    },
  })

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods

  const onSubmit = async (data: EvolutionFormValues) => {
    startTransition(async () => {
      try {
        const imagesToUpload = data.images.filter(
          (img) =>
            (img.imageUrl as unknown) instanceof File ||
            (typeof img.imageUrl === "object" && img.imageUrl !== null),
        )

        let uploadedImagesData: EvolutionImage[] = data.images.map((img) => ({
          name: img.name,
          description: img.description,
          imageUrl: typeof img.imageUrl === "string" ? img.imageUrl : "",
          fileKey: img.fileKey ?? null,
        }))

        if (imagesToUpload.length > 0) {
          const files = imagesToUpload.map(
            (img) => img.imageUrl as unknown as File,
          )

          const uploadResults = await uploadMultipleImages(files)
          let newIndex = 0

          uploadedImagesData = data.images.map((img) => {
            const isFile =
              (img.imageUrl as unknown) instanceof File ||
              (typeof img.imageUrl === "object" && img.imageUrl !== null)

            if (isFile) {
              const url = uploadResults.urls[newIndex]
              const publicId = uploadResults.publicIds[newIndex]
              newIndex++

              return {
                name: img.name,
                description: img.description,
                imageUrl: url,
                fileKey: publicId,
              }
            }

            return {
              name: img.name,
              description: img.description,
              imageUrl: img.imageUrl as string,
              fileKey: img.fileKey ?? null,
            }
          })
        }

        const payload = evolutionSchema.parse({
          ...data,
          images: uploadedImagesData,
        })

        const response = await createEvolutionAction({
          patientId,
          nextSessionNumber,
          data: payload,
        })

        if (response.success) {
          toast.success(response.message)
          methods.reset()
        } else {
          toast.error(response.error)
        }
      } catch (error) {
        console.error("Erro ao criar sessão:", error)
        toast.error("Ocorreu um erro ao salvar a evolução.")
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

          <SessionWorkoutSelector videos={videos} />

          <OptionalImageSession />

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
