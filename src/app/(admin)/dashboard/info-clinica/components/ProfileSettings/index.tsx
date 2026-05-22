"use client"

import { saveClinicProfile } from "@/app/action/save-clinic-profile"
import ImageUpload from "@/components/ImageUpload"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ClinicDTO } from "@/dtos/clinic.dto"
import { profileSetttingsSchema } from "@/schemas/clinic-settings-schema"
import { uploadToCloudinaryClient } from "@/services/image-compresseion.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type ProfileSettingsProps = {
  clinic: ClinicDTO
}

interface SocialMediaJson {
  instagram?: string
  facebook?: string
  linkedin?: string
}

const ProfileSettings = ({ clinic }: ProfileSettingsProps) => {
  const [isPending, startTransition] = useTransition()

  const social = (clinic.socialMedia as SocialMediaJson) || {}

  const methods = useForm<z.infer<typeof profileSetttingsSchema>>({
    resolver: zodResolver(profileSetttingsSchema),
    defaultValues: {
      avatarImageUrl: clinic.avatarImageUrl || "",
      coverImageUrl: clinic.coverImageUrl || "",
      slogan: clinic.slogan || "",
      socialMedia: {
        instagram: social.instagram || "",
        facebook: social.facebook || "",
        linkedin: social.linkedin || "",
      },
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  async function onSubmit(values: z.infer<typeof profileSetttingsSchema>) {
    try {
      let finalAvatarUrl = clinic.avatarImageUrl || ""
      let finalCoverUrl = clinic.coverImageUrl || ""

      if (values.avatarImageUrl instanceof File) {
        const uploadResult = await uploadToCloudinaryClient(
          values.avatarImageUrl,
        )

        finalAvatarUrl = uploadResult.url
      } else if (typeof values.avatarImageUrl === "string") {
        finalAvatarUrl = values.avatarImageUrl
      }

      if (values.coverImageUrl instanceof File) {
        const uploadResult = await uploadToCloudinaryClient(
          values.coverImageUrl,
        )

        finalCoverUrl = uploadResult.url
      } else if (typeof values.coverImageUrl === "string") {
        finalCoverUrl = values.coverImageUrl
      }

      const dataToSend = {
        ...values,
        avatarImageUrl: finalAvatarUrl,
        coverImageUrl: finalCoverUrl,
      }

      startTransition(async () => {
        const response = await saveClinicProfile(dataToSend)

        if (response.success) {
          toast.success("Clínica atualizada com sucesso!")
        } else {
          console.error(response.error)
          toast.error("Erro ao atualizar a clínica")
        }
      })
    } catch (error) {
      console.error("Erro ao processar submit:", error)
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Perfil da Clínica</CardTitle>
        <CardDescription>
          Aparência e links que serão exibidos na Landing Page.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CardContent>
          <FieldGroup className="space-y-4">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <Field>
                <FieldLabel>Logo do Estabelecimento</FieldLabel>
                <ImageUpload
                  name="avatarImageUrl"
                  form={methods}
                  initialUrl={clinic.avatarImageUrl}
                />
              </Field>
              {/* Upload da Capa */}
              <Field>
                <FieldLabel>Imagem de Capa</FieldLabel>
                <ImageUpload
                  name="coverImageUrl"
                  form={methods}
                  initialUrl={clinic.coverImageUrl}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Slogan da Clínica</FieldLabel>
              <Input
                placeholder="Ex: Cuidando do seu movimento"
                {...register("slogan")}
              />
              <FieldError>{errors.slogan?.message}</FieldError>
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Notação de ponto no register funciona nativamente com o JSON! */}
              <Field>
                <FieldLabel>Instagram</FieldLabel>
                <Input
                  placeholder="https://instagram.com/..."
                  {...register("socialMedia.instagram")}
                />
                <FieldError>
                  {errors.socialMedia?.instagram?.message}
                </FieldError>
              </Field>
              <Field>
                <FieldLabel>Facebook</FieldLabel>
                <Input
                  placeholder="https://facebook.com/..."
                  {...register("socialMedia.facebook")}
                />
                <FieldError>{errors.socialMedia?.facebook?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>LinkedIn</FieldLabel>
                <Input
                  placeholder="https://linkedin.com/..."
                  {...register("socialMedia.linkedin")}
                />
                <FieldError>{errors.socialMedia?.linkedin?.message}</FieldError>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            size="lg"
            type="submit"
            disabled={isPending}
            className="w-full md:w-auto"
          >
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ProfileSettings
