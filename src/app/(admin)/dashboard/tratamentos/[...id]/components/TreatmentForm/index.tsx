"use client"

import { saveTreatment } from "@/app/action/save-treatment"
import ImageUpload from "@/components/ImageUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { generateSlug } from "@/helpers/generate-slug"
import { treatmentSchema } from "@/schemas/treatments-schemas"
import { uploadToCloudinaryClient } from "@/services/image-compresseion.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

// 1. Tipagem flexível para aceitar o que vem do Prisma/DTO
type TreatmentFormProps = {
  treatment?: {
    id?: string
    name: string
    description?: string | null
    imageUrl?: string | null
    slug: string
  } | null
}

const TreatmentForm = ({ treatment }: TreatmentFormProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const methods = useForm<z.infer<typeof treatmentSchema>>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      name: treatment?.name || "",
      description: treatment?.description || "",
      imageUrl: treatment?.imageUrl || "",
      slug: treatment?.slug || "",
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = methods

  const name = useWatch({
    control: control,
    name: "name",
  })

  useEffect(() => {
    if (!name) return

    const generatedSlug = generateSlug(name)
    methods.setValue("slug", generatedSlug, { shouldValidate: true })
  }, [name, methods])

  async function onSubmit(values: z.infer<typeof treatmentSchema>) {
    startTransition(async () => {
      try {
        let finalImageUrl = treatment?.imageUrl || ""

        if (values.imageUrl instanceof File) {
          const uploadResult = await uploadToCloudinaryClient(values.imageUrl)
          finalImageUrl = uploadResult.url
        } else if (typeof values.imageUrl === "string") {
          finalImageUrl = values.imageUrl
        }

        const response = await saveTreatment({
          id: treatment?.id,
          name: values.name,
          description: values.description,
          imageUrl: finalImageUrl,
          slug: values.slug,
        })

        if (response.success) {
          toast.success("Tratamento salvo com sucesso!")
          router.push("/dashboard/tratamentos")
        } else {
          console.error(response.error)
          toast.error("Erro ao salvar o tratamento")
        }
      } catch (error) {
        console.error("Erro no fluxo de salvamento:", error)
        toast.error("Ocorreu um erro inesperado.")
      }
    })
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CardContent>
          <FieldGroup className="grid grid-cols-1 gap-4">
            {/* Nome do Tratamento */}
            <Field>
              <FieldLabel>Nome do Tratamento</FieldLabel>
              <Input
                placeholder="Ex: Fisioterapia Traumato-Ortopédica"
                {...register("name")}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            {/* Slug */}
            <Field>
              <FieldLabel>Slug (Link da página do tratamento)</FieldLabel>
              <Input
                placeholder="Ex: fisioterapia-traumato-ortopedica"
                {...register("slug")}
              />
              <FieldError>{errors.slug?.message}</FieldError>
            </Field>

            {/* Descrição do Tratamento */}
            <Field>
              <FieldLabel>Descrição do Tratamento</FieldLabel>
              <Textarea
                placeholder="Descreva detalhadamente como funciona o tratamento, benefícios, indicações..."
                className="min-h-30 resize-none"
                {...register("description")}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>

            {/* Imagem do Tratamento (Seu componente queridinho!) */}
            <Field>
              <FieldLabel>Imagem de Capa do Tratamento</FieldLabel>
              <ImageUpload
                name="imageUrl"
                form={methods}
                initialUrl={treatment?.imageUrl || ""} // 3. Ajustado com "?" para não quebrar no cadastro novo
              />
              <FieldError>{errors.imageUrl?.message?.toString()}</FieldError>
            </Field>
          </FieldGroup>
        </CardContent>

        <div className="flex justify-end px-6">
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto"
            disabled={isPending}
          >
            {isPending
              ? "Salvando..."
              : treatment?.id
                ? "Salvar Alterações"
                : "Cadastrar Tratamento"}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default TreatmentForm
