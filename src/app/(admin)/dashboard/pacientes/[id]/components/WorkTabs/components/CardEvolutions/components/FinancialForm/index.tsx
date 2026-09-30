"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { BillingMode } from "@/constants/enums"
import { BILLING_MODE_LABELS } from "@/constants/labels"
import { EvolutionFormValues } from "@/schemas/patients-schemas"
import { AnimatePresence, motion } from "framer-motion"
import { Controller, useFormContext, useWatch } from "react-hook-form"

type FinancialFormProps = {
  financial: {
    billingDay: number | null
    billingMode: BillingMode
    defaultSessionPrice: number | null
  }
}

const FinancialForm = ({ financial }: FinancialFormProps) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<EvolutionFormValues>()

  const isReturn = useWatch({
    control,
    name: "isReturn",
    defaultValue: false,
  })

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <Controller
            name="isReturn"
            control={control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <FieldLabel>Retorno (ou consulta gratuita)</FieldLabel>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    // Zera o preço no estado real do formulário ao marcar retorno
                    if (checked) {
                      setValue("pricePerSession", 0, { shouldValidate: true })
                    }
                  }}
                />
              </Field>
            )}
          />
        </div>

        <Controller
          control={control}
          name="pricePerSession"
          render={({ field }) => (
            <Field className="w-full max-w-sm">
              <FieldLabel>Preço Sessão</FieldLabel>
              <Input
                type="text"
                inputMode="decimal"
                disabled={isReturn}
                value={
                  isReturn
                    ? "R$ 0,00"
                    : field.value != null && field.value !== undefined
                      ? Number(field.value).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : ""
                }
                onChange={(e) => {
                  if (isReturn) return
                  const digits = e.target.value.replace(/\D/g, "")
                  const num = digits ? Number(digits) / 100 : 0
                  field.onChange(num)
                }}
                onBlur={field.onBlur}
                placeholder="R$ 0,00 (Opcional)"
              />
              <FieldError>
                {errors.pricePerSession?.message as string}
              </FieldError>
            </Field>
          )}
        />
      </div>

      <AnimatePresence mode="wait">
        {isReturn ? (
          <motion.div
            key="return-info"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full overflow-hidden"
          >
            <div className="bg-muted/20 rounded-lg border p-4">
              <h3 className="text-sm font-medium">Configuração de cobrança</h3>
              <p className="text-muted-foreground text-sm">
                Esta consulta não será cobrada (Retorno / Cortesia).
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="billing-info"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full overflow-hidden"
          >
            <div className="bg-muted/30 w-full rounded-lg border p-4">
              <div className="mb-3 border-b pb-2">
                <h3 className="text-sm font-medium">
                  Configuração de cobrança
                </h3>
                <p className="text-muted-foreground text-sm">
                  Informações financeiras definidas para este paciente.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">
                    Forma de cobrança
                  </p>
                  <p className="text-sm font-medium">
                    {BILLING_MODE_LABELS[financial.billingMode]}
                  </p>
                </div>

                {financial.billingMode === BillingMode.ACCUMULATED && (
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">
                      Dia de cobrança
                    </p>
                    <p className="text-sm font-medium">
                      {financial.billingDay
                        ? `Dia ${financial.billingDay}`
                        : "Não definido"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FinancialForm
