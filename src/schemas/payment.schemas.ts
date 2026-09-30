import { ChargeStatus, PaymentMethod } from "@misael1981/physio-database"
import { z } from "zod"

const decimalSchema = z.union([
  z.number(),
  z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor numérico inválido"),
])

// 1. Enums (pode usar z.nativeEnum se importar do @prisma/client, ou z.enum)
export const chargeStatusEnum = z.nativeEnum(ChargeStatus)
export const paymentMethodEnum = z.nativeEnum(PaymentMethod)

// 1. Schema focado apenas nos campos editáveis do Formulário
export const chargeFormSchema = z.object({
  status: chargeStatusEnum.default("OPEN"),

  subtotal: decimalSchema,
  discount: decimalSchema.default(0),
  total: decimalSchema,
  paidAmount: decimalSchema.default(0),

  // z.coerce.date() aceita Date, String ISO ou undefined
  dueDate: z.coerce.date().optional().nullable(),
  paidAt: z.coerce.date().optional().nullable(),
  canceledAt: z.coerce.date().optional().nullable(),

  paymentMethod: paymentMethodEnum.optional().nullable(),
  notes: z.string().optional().nullable(),
})

// Tipo inferido especificamente para os dados do formulário
export type ChargeFormInput = z.input<typeof chargeFormSchema>
export type ChargeFormValue = z.output<typeof chargeFormSchema>
