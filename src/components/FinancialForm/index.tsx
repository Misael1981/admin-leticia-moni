"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { BillingMode } from "@/constants/enums"
import { BILLING_MODE_OPTIONS } from "@/constants/options"
import { PatientFormValues } from "@/schemas/patients-schemas"
import { AnimatePresence, motion } from "framer-motion"
import { Controller, useFormContext } from "react-hook-form"

const FinancialForm = () => {
  const form = useFormContext<PatientFormValues>()
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form

  const billingMode = watch("billingMode")
  const isAccumulated = billingMode === BillingMode.ACCUMULATED

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader className="border-b-2 pb-6">
        <CardTitle>Modo/Data de como será cobrada a consulta</CardTitle>
      </CardHeader>

      <CardContent>
        <FieldGroup className="flex flex-col gap-4 lg:flex-row lg:justify-center">
          <Field className="lg:w-1/3">
            <FieldLabel>Modo de Pagamento</FieldLabel>
            <Controller
              name="billingMode"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(value) => {
                    field.onChange(value)
                    if (value === BillingMode.PER_SESSION) {
                      form.setValue("billingDay", null, {
                        shouldValidate: true,
                      })
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha um modo" />
                  </SelectTrigger>
                  <SelectContent>
                    {BILLING_MODE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.billingMode?.message}</FieldError>
          </Field>

          <AnimatePresence>
            {isAccumulated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Field>
                  <FieldLabel>Dia do Vencimento</FieldLabel>
                  <Input
                    type="number"
                    {...register("billingDay")}
                    placeholder="De 1 a 30..."
                  />
                  <FieldError>{errors.billingDay?.message}</FieldError>
                </Field>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preço  */}
          <div className="lg:w-1/3">
            <Controller
              control={control}
              name="defaultSessionPrice"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Preço Padrão da Sessão</FieldLabel>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={
                      field.value != null
                        ? field.value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : ""
                    }
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "")
                      const num = digits ? Number(digits) / 100 : undefined
                      field.onChange(num)
                    }}
                    onBlur={field.onBlur}
                    placeholder="R$ 0,00 (Opcional)"
                  />
                  <FieldError>{errors.defaultSessionPrice?.message}</FieldError>
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export default FinancialForm
