"use client"

import { saveTreatment } from "@/app/action/save-treatment"
import ImageUpload from "@/components/ImageUpload"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { generateSlug } from "@/helpers/generate-slug"
import {
  treatmentSchema,
  TreatmentFormInputValues,
} from "@/schemas/treatments-schemas"
import { uploadToCloudinaryClient } from "@/services/image-compresseion.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useTransition } from "react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type TreatmentFormProps = {
  treatment?:
    | {
        id: string
        name: string
        slug: string
        imageUrl: string | null
        description: string | null
        about: string | null
        attendanceInfo: string | null
        durationMinWeeks: number | null
        durationMaxWeeks: number | null
        sessionsPerWeekMin: number | null
        sessionsPerWeekMax: number | null
        sessionDurationMinutes: number | null
        benefits: string[]
      }
    | null
    | undefined
}

const TreatmentForm = ({ treatment }: TreatmentFormProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const methods = useForm<TreatmentFormInputValues>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      name: treatment?.name || "",
      slug: treatment?.slug || "",
      imageUrl: treatment?.imageUrl || "",

      description: treatment?.description || "",
      about: treatment?.about || "",
      attendanceInfo: treatment?.attendanceInfo || "",

      durationMinWeeks: treatment?.durationMinWeeks || undefined,
      durationMaxWeeks: treatment?.durationMaxWeeks || undefined,
      sessionsPerWeekMin: treatment?.sessionsPerWeekMin || undefined,
      sessionsPerWeekMax: treatment?.sessionsPerWeekMax || undefined,

      sessionDurationMinutes: treatment?.sessionDurationMinutes || undefined,
      benefits: treatment?.benefits ? treatment.benefits.join(", ") : "",
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

        const benefitsArray =
          values.benefits
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean) ?? []

        const response = await saveTreatment({
          id: treatment?.id,
          name: values.name,
          imageUrl: finalImageUrl,
          slug: values.slug,
          benefits: benefitsArray,
          description: values.description,
          about: values.about,
          attendanceInfo: values.attendanceInfo,
          durationMinWeeks: values.durationMinWeeks,
          durationMaxWeeks: values.durationMaxWeeks,
          sessionsPerWeekMin: values.sessionsPerWeekMin,
          sessionsPerWeekMax: values.sessionsPerWeekMax,
          sessionDurationMinutes: values.sessionDurationMinutes,
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
        <CardContent className="p-0 lg:px-6">
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

            {/* O que é o Tratamento */}
            <Field>
              <FieldLabel>Descreva o que é o Tratamento</FieldLabel>
              <Textarea
                placeholder="Fale um pouco sobre o que é o tratamento, como é desenvolvido..."
                className="min-h-30 resize-none"
                {...register("about")}
              />
              <FieldError>{errors.about?.message}</FieldError>
            </Field>

            {/* Como é o Tratamento */}
            <Field>
              <FieldLabel>Como é o Tratamento</FieldLabel>
              <Textarea
                placeholder="Ex: Cada plano é personalizado após avaliação detalhada. Os exercícios são realizados em consultório e em casa, com acompanhamento contínuo da evolução do paciente."
                className="min-h-30 resize-none"
                {...register("attendanceInfo")}
              />
              <FieldError>{errors.attendanceInfo?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Tags (separadas por vírgula)</FieldLabel>
              <Input
                placeholder="Ex: Tontura, Vertigem posicional, Pós-cirúrgico"
                {...register("benefits")}
              />
              <FieldError>{errors.benefits?.message}</FieldError>
            </Field>

            {/* Informações de Duração */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg">Informações de Duração</Label>
                {/* Duração do Atendimento */}
                <Field className="max-w-md">
                  <FieldLabel>Tempo de Atendimento</FieldLabel>
                  <FieldDescription>
                    Duração da sessão em minutos
                  </FieldDescription>
                  <Input
                    type="number"
                    placeholder="50 minutos"
                    {...register("sessionDurationMinutes", {
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError>
                    {errors.sessionDurationMinutes?.message}
                  </FieldError>
                </Field>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1 space-y-2">
                  <FieldDescription>
                    Número de semanas de atendimento
                  </FieldDescription>
                  <div className="flex gap-4">
                    <Field>
                      <FieldLabel>Duração Mínima</FieldLabel>
                      <Input
                        type="number"
                        placeholder="10"
                        {...register("durationMinWeeks", {
                          valueAsNumber: true,
                        })}
                      />
                      <FieldError>
                        {errors.durationMinWeeks?.message}
                      </FieldError>
                    </Field>
                    <Field>
                      <FieldLabel>Duração Máxima</FieldLabel>
                      <Input
                        type="number"
                        placeholder="12"
                        {...register("durationMaxWeeks", {
                          valueAsNumber: true,
                        })}
                      />
                      <FieldError>
                        {errors.durationMaxWeeks?.message}
                      </FieldError>
                    </Field>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <FieldDescription>
                    Número de atendimentos por semana
                  </FieldDescription>
                  <div className="flex gap-4">
                    <Field>
                      <FieldLabel>Mínimo</FieldLabel>
                      <Input
                        type="number"
                        placeholder="2"
                        {...register("sessionsPerWeekMin", {
                          valueAsNumber: true,
                        })}
                      />
                      <FieldError>
                        {errors.sessionsPerWeekMin?.message}
                      </FieldError>
                    </Field>
                    <Field>
                      <FieldLabel>Máximo</FieldLabel>
                      <Input
                        type="number"
                        placeholder="3"
                        {...register("sessionsPerWeekMax", {
                          valueAsNumber: true,
                        })}
                      />
                      <FieldError>
                        {errors.sessionsPerWeekMax?.message}
                      </FieldError>
                    </Field>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagem do Tratamento  */}
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
