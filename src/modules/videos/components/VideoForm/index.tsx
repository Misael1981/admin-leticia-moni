"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VideoType } from "../../queries/get-videos.queries"
import { useForm } from "react-hook-form"
import {
  VideoFormInput,
  VideoFormValues,
  videoSchema,
} from "../../schemas/video-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import VideoUpload from "../VideoUpload"
import ImageUpload from "@/components/ImageUpload"
import { upsertVideoAction } from "../../actions/upsert-video.action"
import { toast } from "sonner"
import { uploadVideoToCloudinaryClient } from "@/services/video-compresseion.service"
import { uploadToCloudinaryClient } from "@/services/image-compresseion.service"
import { useRouter } from "next/navigation"
import { getCloudinaryVideoThumbnail } from "../../helpers/get-cloudinary-video-thumbnail"

type VideoFormProps = {
  initialData?: VideoType | null
}

const VideoForm = ({ initialData }: VideoFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const methods = useForm<VideoFormInput, unknown, VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      url: initialData?.url ?? "",
      thumbnailUrl: initialData?.thumbnailUrl ?? "",
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods

  const onSubmit = async (values: VideoFormValues) => {
    startTransition(async () => {
      try {
        let finalVideoUrl = typeof values.url === "string" ? values.url : ""
        let finalThumbnailUrl =
          typeof values.thumbnailUrl === "string" ? values.thumbnailUrl : ""
        let finalPublicId = values.cloudinaryPublicId
        let finalDuration = values.durationSeconds

        // 1. Upload do Vídeo (Executado primeiro)
        if (values.url instanceof File) {
          const videoResult = await uploadVideoToCloudinaryClient(values.url)
          finalVideoUrl = videoResult.url
          finalPublicId = videoResult.publicId
          // Se o Cloudinary retornar a duração, aproveitamos ela aqui também:
          finalDuration = videoResult.duration || finalDuration
        }

        // 2. Upload da Thumbnail Customizada (se houver arquivo novo)
        if (values.thumbnailUrl instanceof File) {
          const thumbResult = await uploadToCloudinaryClient(
            values.thumbnailUrl,
          )
          finalThumbnailUrl = thumbResult.url
        }

        // 3. Fallback: Se NÃO tem thumbnail personalizada, gera a capa do Cloudinary
        if (!finalThumbnailUrl && finalVideoUrl) {
          finalThumbnailUrl = getCloudinaryVideoThumbnail(finalVideoUrl)
        }

        // 4. Dispara a Server Action com os dados zerados
        const result = await upsertVideoAction(
          {
            ...values,
            url: finalVideoUrl,
            thumbnailUrl: finalThumbnailUrl,
            cloudinaryPublicId: finalPublicId,
            durationSeconds: finalDuration,
          },
          initialData?.id,
        )

        if (result.success) {
          toast.success(result.message)
          router.push("/dashboard/videos")
        } else {
          toast.error(result.error)
        }
      } catch (error) {
        toast.error("Falha ao realizar upload dos arquivos.")
        console.log("Falha ao realizar upload dos arquivos.", error)
      }
    })
  }

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>Formulário para postagem/edição de vídeo treino</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <FieldGroup className="space-y-6">
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row">
              <Field className="w-full lg:w-1/2">
                <FieldLabel>Título</FieldLabel>
                <Input
                  placeholder="Ex: Mobilidade de Tornozelo com Faixa"
                  {...register("name")}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field className="w-full lg:w-1/2">
                <FieldLabel>Categoria</FieldLabel>
                <Input
                  placeholder="Ex: Membros Inferiores, Coluna, Ombro"
                  {...register("category")}
                />
                <FieldError>{errors.category?.message}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel>Descrição</FieldLabel>
              <Textarea
                className="min-h-24 resize-y"
                placeholder="Descrição do treino e algumas especificações de como deve ser executado..."
                {...register("description")}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>

            <div className="flex flex-col gap-4 lg:flex-row">
              <Field className="w-full lg:w-1/2">
                <FieldLabel>Thumbnail (Opcional)</FieldLabel>
                <ImageUpload
                  name="thumbnailUrl"
                  form={methods}
                  initialUrl={initialData?.thumbnailUrl}
                />
                <FieldError>
                  {errors.thumbnailUrl?.message as string}
                </FieldError>
              </Field>

              <Field className="w-full lg:w-1/2">
                <FieldLabel>Upload do Vídeo</FieldLabel>
                <VideoUpload
                  form={methods}
                  name="url"
                  durationName="durationSeconds"
                  initialUrl={initialData?.url}
                />
                <FieldError>{errors.url?.message as string}</FieldError>
              </Field>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <div className="flex w-full justify-center">
              <Button
                className="w-full max-w-xl"
                type="submit"
                size="lg"
                disabled={isPending || !isDirty}
              >
                {isPending
                  ? "Salvando..."
                  : initialData
                    ? "Atualizar Vídeo Treino"
                    : "Postar Vídeo Treino"}
              </Button>
            </div>
          </CardFooter>
        </FieldGroup>
      </form>
    </Card>
  )
}

export default VideoForm
