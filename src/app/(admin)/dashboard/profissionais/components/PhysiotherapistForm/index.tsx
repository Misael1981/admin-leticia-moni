"use client"

import { createPhysiotherapistAction } from "@/app/action/physiotherapists.action"
import ImageUpload from "@/components/ImageUpload"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import { Textarea } from "@/components/ui/textarea"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { maskCrefito } from "@/helpers/mask-crefito"
import {
  PhysiotherapistFormInput,
  physiotherapistFormSchema,
  PhysiotherapistFormValues,
} from "@/schemas/physiotherapist.schemas"
import { uploadToCloudinaryClient } from "@/services/image-compresseion.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const PhysiotherapistForm = () => {
  const [isPending, startTransition] = useTransition()

  const methods = useForm<PhysiotherapistFormValues>({
    resolver: zodResolver(physiotherapistFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      imageUrl: "",
      description: "",
      crefito: "",
    },
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  const onSubmit = (data: PhysiotherapistFormValues) => {
    startTransition(async () => {
      try {
        let finalImageUrl = ""

        const imageValue = data.imageUrl as unknown

        if (imageValue instanceof File) {
          const uploadResult = await uploadToCloudinaryClient(imageValue)
          finalImageUrl = uploadResult.url
        } else if (typeof data.imageUrl === "string") {
          finalImageUrl = data.imageUrl
        }

        const payload: PhysiotherapistFormInput = {
          name: data.name,
          phone: data.phone || null,
          description: data.description || null,
          crefito: data.crefito || null,
          imageUrl: finalImageUrl || null,
        }

        const clinicId = "main-clinic"

        const response = await createPhysiotherapistAction(payload, clinicId)

        if (!response.success) {
          toast.error(response.error)
          return
        }

        toast.success("Fisioterapeuta cadastrado com sucesso!")
        methods.reset()
      } catch (error) {
        console.error("Erro ao criar fisioterapeuta:", error)
        toast.error("Ocorreu um erro ao criar o fisioterapeuta.")
      }
    })
  }

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle>Adicionar Fisioterapeuta</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <CardContent>
          <FieldGroup>
            <div className="flex flex-col gap-4 lg:flex-row">
              <Field>
                <FieldLabel>Nome Completo</FieldLabel>
                <Input
                  placeholder="Nome..."
                  disabled={isPending}
                  {...register("name")}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Telefone de Contato</FieldLabel>
                <Input
                  placeholder="(00) 00000-0000"
                  disabled={isPending}
                  {...register("phone", {
                    onChange: (e) => {
                      e.target.value = formatPhoneNumber(e.target.value)
                    },
                  })}
                />
                <FieldError>{errors.phone?.message}</FieldError>
              </Field>
            </div>

            <div className="flex justify-center">
              <Field className="w-full max-w-xl">
                <FieldLabel>Foto do Profissional</FieldLabel>
                <ImageUpload name="imageUrl" form={methods} initialUrl="" />
                <FieldError>{errors.imageUrl?.message}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel>Pequena Descrição Sobre o Profissional</FieldLabel>
              <Textarea
                placeholder="Campo opcional..."
                className="min-h-30 resize-none"
                disabled={isPending}
                {...register("description")}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>

            <div className="flex justify-center">
              <Field className="w-full max-w-lg">
                <FieldLabel>CREFITO</FieldLabel>
                <Input
                  type="text"
                  placeholder="123456-F ou 123456-SP"
                  maxLength={9}
                  disabled={isPending}
                  {...register("crefito", {
                    onChange: (e) => {
                      e.target.value = maskCrefito(e.target.value)
                    },
                  })}
                />
                <FieldError>{errors.crefito?.message}</FieldError>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="mt-6 flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Cadastrar Fisioterapeuta"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default PhysiotherapistForm
