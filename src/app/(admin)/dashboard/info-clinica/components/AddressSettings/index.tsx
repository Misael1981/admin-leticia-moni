"use client"

import { saveClinicAddress } from "@/app/action/save-clinic-address"
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
import { addressSchema } from "@/schemas/clinic-settings-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

type AddressSettingsProps = {
  clinic: ClinicDTO
}

const AddressSettings = ({ clinic }: AddressSettingsProps) => {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: clinic.street || "",
      number: clinic.number || "",
      complement: clinic.complement || "",
      neighborhood: clinic.neighborhood || "",
      city: clinic.city || "",
      state: clinic.state || "",
      zipCode: clinic.zipCode || "",
    },
  })

  async function onSubmit(values: z.infer<typeof addressSchema>) {
    try {
      startTransition(async () => {
        const response = await saveClinicAddress(values)

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
        <CardTitle>Endereço</CardTitle>
        <CardDescription>
          Dados opcionais de localização da clínica.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CardContent>
          <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field className="md:col-span-2">
              <FieldLabel>Rua</FieldLabel>
              <Input placeholder="Av. Principal" {...register("street")} />
              <FieldError>{errors.street?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Número</FieldLabel>
              <Input placeholder="123" {...register("number")} />
              <FieldError>{errors.number?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Bairro</FieldLabel>
              <Input {...register("neighborhood")} placeholder="Centro" />
              {errors.neighborhood && (
                <p className="text-xs text-red-500">
                  {errors.neighborhood.message}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel>Cidade</FieldLabel>
              <Input {...register("city")} placeholder="Pouso Alegre" />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel>Estado</FieldLabel>
              <Input {...register("state")} placeholder="MG" />
              {errors.state && (
                <p className="text-xs text-red-500">{errors.state.message}</p>
              )}
            </Field>
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

export default AddressSettings
