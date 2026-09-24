"use client"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { BillingMode } from "@/constants/enums"
import { BILLING_MODE_LABELS } from "@/constants/labels"
import { EvolutionFormValues } from "@/schemas/patients-schemas"
import { Controller, useFormContext } from "react-hook-form"

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
    formState: { errors },
  } = useFormContext<EvolutionFormValues>()

  return (
    <div className="space-y-4">
      <Controller
        control={control}
        name="pricePerSession"
        render={({ field }) => (
          <Field className="max-w-sm">
            <FieldLabel>Preço Sessão</FieldLabel>
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
            <FieldError>{errors.pricePerSession?.message}</FieldError>
          </Field>
        )}
      />

      <div className="bg-muted/30 rounded-lg border p-4">
        <div className="mb-3 border-b pb-2">
          <h3 className="text-sm font-medium">Configuração de cobrança</h3>
          <p className="text-muted-foreground text-sm">
            Informações financeiras definidas para este paciente.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm">Forma de cobrança</p>

            <p className="text-sm font-medium">
              {BILLING_MODE_LABELS[financial.billingMode]}
            </p>
          </div>

          {financial.billingMode === BillingMode.ACCUMULATED && (
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Dia de cobrança</p>

              <p className="text-sm font-medium">
                {financial.billingDay ?? "Não definido"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FinancialForm
