import {
  Card,
  CardContent,
  CardDescription,
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
import {
  EDUCATION_LEVEL_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from "@/constants/options"
import { maskCPF, maskRG } from "@/helpers/personal-documents"
import { PatientFormValues } from "@/schemas/patients-schemas"
import { Controller, useFormContext } from "react-hook-form"

const DocumentationFormCard = () => {
  const form = useFormContext<PatientFormValues>()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader className="border-b-2 pb-6">
        <CardTitle>Documentação e Dados Pessoais</CardTitle>
        <CardDescription>
          Dados civis e documentos utilizados para cadastro e identificação
          oficial do paciente.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field>
              <FieldLabel>CPF</FieldLabel>
              <Input
                {...register("cpf")}
                placeholder="aaa.aaa.aaa-aa"
                onChange={(e) => {
                  e.target.value = maskCPF(e.target.value)
                }}
              />
              <FieldError>{errors.cpf?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>RG</FieldLabel>
              <Input
                {...register("rg")}
                placeholder="aa.aaa.aaa-a"
                onChange={(e) => {
                  e.target.value = maskRG(e.target.value)
                }}
              />
              <FieldError>{errors.rg?.message}</FieldError>
            </Field>

            <div className="flex justify-center lg:col-span-2">
              <Field className="w-full max-w-xl">
                <FieldLabel>Profissão</FieldLabel>
                <Input
                  placeholder="Profissão ou ocupação do paciente"
                  {...register("profession")}
                />
                <FieldError>{errors.profession?.message}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel>Estado Civil</FieldLabel>
              <Controller
                name="maritalStatus"
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
                      {MARITAL_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.maritalStatus?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Escolaridade</FieldLabel>
              <Controller
                name="education"
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
                      {EDUCATION_LEVEL_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.education?.message}</FieldError>
            </Field>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export default DocumentationFormCard
