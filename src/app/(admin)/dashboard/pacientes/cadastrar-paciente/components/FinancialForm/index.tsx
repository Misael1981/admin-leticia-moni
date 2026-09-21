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

      <CardContent className="flex justify-center">
        <FieldGroup className="flex max-w-lg flex-col gap-4 md:flex-row">
          <Field>
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
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export default FinancialForm
