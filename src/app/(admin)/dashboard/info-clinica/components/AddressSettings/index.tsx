"use client"

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
import { useForm } from "react-hook-form"
import z from "zod"

type AddressSettingsProps = {
  clinic: ClinicDTO
}

const AddressSettings = ({ clinic }: AddressSettingsProps) => {
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
    console.log(values)
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
              <Input {...register("neighborhood")} />
              {errors.neighborhood && (
                <p className="text-xs text-red-500">
                  {errors.neighborhood.message}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel>Cidade</FieldLabel>
              <Input {...register("city")} />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel>Estado</FieldLabel>
              <Input {...register("state")} />
              {errors.state && (
                <p className="text-xs text-red-500">{errors.state.message}</p>
              )}
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

export default AddressSettings
