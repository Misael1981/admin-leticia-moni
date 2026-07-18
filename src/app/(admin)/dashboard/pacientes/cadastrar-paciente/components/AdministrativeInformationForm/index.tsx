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
import { Switch } from "@/components/ui/switch"
import {
  PATIENT_REFERRAL_SOURCE_OPTION,
  PATIENT_STATUS_OPTIONS,
} from "@/constants/options"
import { PatientFormValues } from "@/schemas/patients-schemas"
import { AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

const AdministrativeInformationForm = () => {
  const form = useFormContext<PatientFormValues>()
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form

  const hasInsurance = watch("hasInsurance")

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader className="border-b-2 pb-6">
        <CardTitle>Informações Clínicas e Administrativas</CardTitle>
        <CardDescription>
          Dados relacionados ao atendimento, convênio e situação do paciente na
          clínica.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-4 lg:col-span-2">
              <Field
                orientation="horizontal"
                className="flex w-fit items-center gap-2"
              >
                <FieldLabel>Possui Convênio</FieldLabel>
                <Controller<PatientFormValues, "hasInsurance">
                  control={control}
                  name="hasInsurance"
                  render={({ field }) => {
                    const checked = Boolean(field.value)

                    return (
                      <Switch
                        checked={checked}
                        onCheckedChange={field.onChange}
                      />
                    )
                  }}
                />
              </Field>
              <AnimatePresence>
                {hasInsurance && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="w-full gap-4 space-y-4 lg:flex">
                      <Field>
                        <FieldLabel>Nome do Convênio</FieldLabel>
                        <Input {...register("insuranceName")} />
                        <FieldError>{errors.insuranceName?.message}</FieldError>
                      </Field>

                      <Field>
                        <FieldLabel>Número da Carteirinha</FieldLabel>
                        <Input {...register("insuranceNumber")} />
                        <FieldError>
                          {errors.insuranceNumber?.message}
                        </FieldError>
                      </Field>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Field>
              <FieldLabel>Como me conheceu?</FieldLabel>
              <Controller
                name="patientSource"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tipo de indicação" />
                    </SelectTrigger>
                    <SelectContent>
                      {PATIENT_REFERRAL_SOURCE_OPTION.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError>{errors.patientSource?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Indicação de Profissional da Saúde</FieldLabel>
              <Input
                {...register("referralProfessional")}
                placeholder="Nome do Profissional ou Instituto"
              />
              <FieldError>{errors.referralProfessional?.message}</FieldError>
            </Field>

            <div className="flex justify-center lg:col-span-2">
              <Field className="w-full max-w-lg">
                <FieldLabel>Status</FieldLabel>
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PATIENT_STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.status?.message}</FieldError>
              </Field>
            </div>
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

export default AdministrativeInformationForm
