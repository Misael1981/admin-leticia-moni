"use client"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field"
import { Controller, useFormContext } from "react-hook-form"
import { Input } from "../ui/input"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { USER_ROLE_OPTIONS } from "@/constants/options"
import ImageUpload from "../ImageUpload"
import { UserFormValues } from "@/schemas/users-schemas"

const UserForm = () => {
  const form = useFormContext<UserFormValues>()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <FieldGroup>
      <div className="lg: flex flex-col gap-4 lg:flex-row">
        <Field>
          <FieldLabel>Nome Completo</FieldLabel>
          <Input placeholder="Nome..." {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Telefone de Contato</FieldLabel>
          <Input
            {...register("phone")}
            placeholder="00 0 0000-0000"
            onChange={(e) => {
              e.target.value = formatPhoneNumber(e.target.value)
            }}
          />
          <FieldError>{errors.phone?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <FieldLabel>E-mail Pessoal</FieldLabel>

        <FieldDescription>
          Atenção: Este e-mail deve ser um gmail e ele que dará acesso do
          usuário à página.
        </FieldDescription>

        <Input placeholder="Campo opcional" {...register("email")} />

        <FieldError>{errors.email?.message}</FieldError>
      </Field>

      <div className="flex justify-center">
        <Field className="w-full max-w-lg">
          <FieldLabel>Perfil de Acesso</FieldLabel>
          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.role?.message}</FieldError>
        </Field>
      </div>

      <div className="flex justify-center lg:col-span-2">
        <Field className="w-full max-w-xl">
          <FieldLabel>Foto do Usuário</FieldLabel>
          <ImageUpload name="image" form={form} initialUrl="" />
        </Field>
      </div>
    </FieldGroup>
  )
}

export default UserForm
