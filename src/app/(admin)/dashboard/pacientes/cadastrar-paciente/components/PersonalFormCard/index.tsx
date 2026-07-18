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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BIOLOGICAL_SEX_OPTIONS } from "@/constants/options"
import { maskDate } from "@/helpers/mask-date"
import { PatientFormValues } from "@/schemas/patients-schemas"
import { Check } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

const PersonalFormCard = () => {
  const form = useFormContext<PatientFormValues>()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader className="border-b-2 pb-6">
        <CardTitle>Identificação do Paciente</CardTitle>
        <CardDescription>
          Informações básicas utilizadas para identificar o paciente dentro da
          clínica.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field>
              <FieldLabel>Nome Completo</FieldLabel>
              <Input placeholder="Nome..." {...register("name")} />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Apelido</FieldLabel>
              <Input
                placeholder="Apelido ou nome social"
                {...register("nickname")}
              />
              <FieldError>{errors.nickname?.message}</FieldError>
            </Field>

            <div className="flex justify-center lg:col-span-2">
              <Field className="w-full max-w-xl">
                <FieldLabel>Foto do Paciente</FieldLabel>
                <ImageUpload name="avatarUrl" form={form} initialUrl="" />
              </Field>
            </div>

            <Field>
              <FieldLabel>Sexo Biológico</FieldLabel>
              <Controller
                name="biologicalSex"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {BIOLOGICAL_SEX_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.biologicalSex?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Identidade de gênero</FieldLabel>

              <Input
                placeholder="Como o paciente se identifica"
                {...register("gender")}
              />
              <FieldError>{errors.gender?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Data de Nascimento</FieldLabel>
              <Input
                {...register("birthDate")}
                placeholder="dd/mm/aaaa"
                onChange={(e) => {
                  e.target.value = maskDate(e.target.value)
                }}
              />
              <FieldError>{errors.birthDate?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Nacionalidade</FieldLabel>
              <Input {...register("nationality")} />
              <FieldError>{errors.nationality?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Cidade em que nasceu</FieldLabel>
              <Input {...register("birthCity")} />
              <FieldError>{errors.birthCity?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Estado em que nasceu</FieldLabel>
              <Input {...register("birthState")} />
              <FieldError>{errors.birthState?.message}</FieldError>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>

      <CardFooter className="border-t-2 pt-6 lg:flex lg:justify-end">
        <Button>
          <Check />
          Salvar Informações
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PersonalFormCard
