"use client"

import { saveClinicContact } from "@/app/action/save-clinic-contact"
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
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { contactSettingsSchema } from "@/schemas/clinic-settings-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type ContactSettingsProps = {
  clinic: ClinicDTO
}

const ContactSettings = ({ clinic }: ContactSettingsProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof contactSettingsSchema>>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      name: clinic.name || "",
      whatsapp: clinic.whatsapp || "",
      phone: clinic.phone || "",
      email: clinic.email || "",
    },
  })

  async function onSubmit(values: z.infer<typeof contactSettingsSchema>) {
    try {
      const response = await saveClinicContact(values)

      if (response.success) {
        toast.success("Clínica atualizada com sucesso!")
      } else {
        console.error(response.error)
        toast.error("Erro ao atualizar a clínica")
      }
    } catch (error) {
      console.error("Erro ao processar submit:", error)
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Informações de Contato</CardTitle>
        <CardDescription>
          Informações básicas de atendimento da clínica.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CardContent>
          {/* Nova API: Usando FieldGroup para agrupar e organizar com grid */}
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Nome da Clínica</FieldLabel>
              <Input
                placeholder="Ex: Letícia Fisioterapia"
                {...register("name")}
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>E-mail de Contato</FieldLabel>
              <Input placeholder="contato@clinica.com" {...register("email")} />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>WhatsApp Comercial</FieldLabel>
              <Input
                placeholder="(35) 99999-9999"
                {...register("whatsapp")}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value)
                  e.target.value = formatted
                  setValue("whatsapp", formatted, { shouldValidate: true })
                }}
              />
              <FieldError>{errors.whatsapp?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Telefone Fixo</FieldLabel>
              <Input
                placeholder="(35) 3456-7890"
                {...register("phone")}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value)
                  e.target.value = formatted
                  setValue("phone", formatted, { shouldValidate: true })
                }}
              />
              <FieldError>{errors.phone?.message}</FieldError>
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" size="lg" className="w-full md:w-auto">
            Salvar Alterações
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ContactSettings
