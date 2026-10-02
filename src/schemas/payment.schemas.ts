import { ChargeStatus, PaymentMethod } from "@misael1981/physio-database"
import { z } from "zod"

const decimalSchema = z.union([
  z.number(),
  z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor numérico inválido"),
])

export const chargeStatusEnum = z.nativeEnum(ChargeStatus)
export const paymentMethodEnum = z.nativeEnum(PaymentMethod)

export const chargeFormSchema = z.object({
  discount: decimalSchema.default(0),
  paidAmount: decimalSchema.default(0),

  paymentMethod: paymentMethodEnum.optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type ChargeFormInput = z.input<typeof chargeFormSchema>
export type ChargeFormValue = z.output<typeof chargeFormSchema>
