"use server"

import { getNextBillingDate } from "@/helpers/billing-date"
import { deriveChargeStatus } from "@/helpers/charge-helpers"
import { serialize } from "@/helpers/serialize"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { chargeFormSchema } from "@/schemas/payment.schemas"
import { Prisma } from "@misael1981/physio-database"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const closeAccumulatedChargeSchema = z.object({
  chargeItemIds: z
    .array(z.string().min(1))
    .min(1, "Selecione pelo menos uma consulta."),
  data: chargeFormSchema,
})

type CloseAccumulatedChargeParams = z.infer<typeof closeAccumulatedChargeSchema>

export async function closeAccumulatedChargeAction(
  params: CloseAccumulatedChargeParams,
) {
  // 1. Auth
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado." }
  }

  // 2. Zod
  const result = closeAccumulatedChargeSchema.safeParse(params)
  if (!result.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      errors: result.error.flatten().fieldErrors,
    }
  }
  const { chargeItemIds, data } = result.data

  try {
    const newCharge = await db.$transaction(async (tx) => {
      // 3. Busca os ChargeItems + validações de integridade
      const chargeItems = await tx.chargeItem.findMany({
        where: { id: { in: chargeItemIds } },
        include: {
          patient: {
            select: {
              id: true,
              billingDay: true,
              billingMode: true,
            },
          },
        },
      })

      if (chargeItems.length !== chargeItemIds.length) {
        throw new Error("CHARGE_ITEMS_NOT_FOUND")
      }

      // Todos órfãos?
      if (chargeItems.some((item) => item.chargeId !== null)) {
        throw new Error("CHARGE_ITEMS_ALREADY_BILLED")
      }

      // Todos do mesmo paciente?
      const patientIds = new Set(chargeItems.map((i) => i.patientId))
      if (patientIds.size !== 1) {
        throw new Error("CHARGE_ITEMS_FROM_DIFFERENT_PATIENTS")
      }

      // Nenhum retorno?
      if (chargeItems.some((item) => item.isReturn)) {
        throw new Error("RETURN_ITEMS_NOT_BILLABLE")
      }

      const firstItem = chargeItems[0]
      const patient = firstItem.patient

      // Paciente ACCUMULATED?
      if (patient.billingMode !== "ACCUMULATED") {
        throw new Error("PATIENT_NOT_ACCUMULATED")
      }

      if (!patient.billingDay) {
        throw new Error("PATIENT_NO_BILLING_DAY")
      }

      // 4. Calcula valores (sempre do banco, nunca do form)
      const subtotal = chargeItems.reduce(
        (acc, item) => acc + Number(item.adjustedAmount ?? item.amount),
        0,
      )
      const discount = Number(data.discount ?? 0)
      const paidAmount = Number(data.paidAmount ?? 0)
      const total = subtotal - discount

      if (discount > subtotal) {
        throw new Error("DISCOUNT_GREATER_THAN_SUBTOTAL")
      }
      if (paidAmount > total) {
        throw new Error("PAID_AMOUNT_GREATER_THAN_TOTAL")
      }

      // 5. Deriva status
      const dueDate = getNextBillingDate(patient.billingDay)
      const status = deriveChargeStatus({
        status: "OPEN", // status base — o helper decide
        paidAmount,
        total,
        dueDate,
      })

      const isPaid = status === "PAID"

      // 6. Cria Charge + vincula itens (mesma transação)
      const charge = await tx.charge.create({
        data: {
          status,
          subtotal: subtotal.toFixed(2),
          discount: discount.toFixed(2),
          total: total.toFixed(2),
          paidAmount: paidAmount.toFixed(2),
          dueDate,
          paidAt: isPaid ? new Date() : null,
          paidById: isPaid ? session.user.id : null,
          paymentMethod: data.paymentMethod ?? null,
          notes: data.notes ?? null,
          patientId: patient.id,
          clinicId: firstItem.clinicId,
          createdById: session.user.id,
        },
      })

      // Vincula os itens
      await tx.chargeItem.updateMany({
        where: { id: { in: chargeItemIds } },
        data: { chargeId: charge.id },
      })

      // Recarrega a Charge com os itens vinculados
      return tx.charge.findUniqueOrThrow({
        where: { id: charge.id },
        include: { items: true },
      })
    })

    // 7. Revalida
    revalidatePath("/dashboard/financeiro")

    // 8. Retorna serializado
    return {
      success: true,
      message: "Fatura fechada com sucesso!",
      data: serialize(newCharge),
    }
  } catch (error) {
    console.error("❌ Erro ao fechar fatura acumulada:", error)

    if (error instanceof Error) {
      const map: Record<string, string> = {
        CHARGE_ITEMS_NOT_FOUND: "Algumas consultas não foram encontradas.",
        CHARGE_ITEMS_ALREADY_BILLED:
          "Uma ou mais consultas já foram faturadas.",
        CHARGE_ITEMS_FROM_DIFFERENT_PATIENTS:
          "Todas as consultas devem ser do mesmo paciente.",
        RETURN_ITEMS_NOT_BILLABLE:
          "Consultas de retorno não podem ser faturadas.",
        PATIENT_NOT_ACCUMULATED: "Este paciente não é do tipo acumulado.",
        PATIENT_NO_BILLING_DAY: "Paciente sem dia de vencimento definido.",
        DISCOUNT_GREATER_THAN_SUBtotal:
          "O desconto não pode ser maior que o valor das consultas.",
        PAID_AMOUNT_GREATER_THAN_TOTAL:
          "O valor pago não pode ser maior que o total.",
      }
      if (map[error.message]) {
        return { success: false, error: map[error.message] }
      }
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { success: false, error: "Fatura não encontrada." }
      }
    }

    return {
      success: false,
      error: "Ocorreu um erro ao fechar a fatura.",
    }
  }
}
