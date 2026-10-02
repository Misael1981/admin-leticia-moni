"use server"

import { deriveChargeStatus } from "@/helpers/charge-helpers"
import { serialize } from "@/helpers/serialize"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { ChargeFormInput, chargeFormSchema } from "@/schemas/payment.schemas"
import { Prisma } from "@misael1981/physio-database"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

interface ManageChargeParams {
  chargeItemId: string
  data: ChargeFormInput
}

export async function manageChargeAction({
  chargeItemId,
  data,
}: ManageChargeParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado." }
  }

  // 2. Validação Zod (só o que o admin controla)
  const result = chargeFormSchema.safeParse(data)
  if (!result.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      errors: result.error.flatten().fieldErrors,
    }
  }
  const validatedData = result.data

  try {
    // 3. Busca ChargeItem + Charge + Patient (fonte de verdade)
    const chargeItem = await db.chargeItem.findUnique({
      where: { id: chargeItemId },
      include: {
        charge: true,
        patient: { select: { id: true } },
        evolution: { select: { sessionDate: true } },
      },
    })

    if (!chargeItem) {
      return { success: false, error: "Consulta não encontrada." }
    }

    if (chargeItem.isReturn) {
      return { success: false, error: "Retornos não geram cobrança." }
    }

    // 4. Se não tem Charge vinculada, cria uma agora
    let charge = chargeItem.charge

    if (!charge) {
      charge = await db.charge.create({
        data: {
          status: "OPEN",
          subtotal: chargeItem.amount,
          discount: 0,
          total: chargeItem.amount,
          paidAmount: 0,
          dueDate: chargeItem.evolution.sessionDate,
          patientId: chargeItem.patientId,
          clinicId: chargeItem.clinicId,
          createdById: session.user.id,
          items: { connect: { id: chargeItem.id } },
        },
      })
    }

    // 4. Validações de negócio
    if (charge.status === "CANCELED") {
      return {
        success: false,
        error: "Esta cobrança foi cancelada e não pode ser alterada.",
      }
    }

    // 5. Calcula valores (subtotal vem do BANCO, não do form)
    const subtotal = Number(charge.subtotal)
    const discount = Number(validatedData.discount)
    const paidAmount = Number(validatedData.paidAmount)
    const total = subtotal - discount

    if (discount > subtotal) {
      return {
        success: false,
        error: "O desconto não pode ser maior que o valor da cobrança.",
      }
    }

    if (paidAmount > total) {
      return {
        success: false,
        error: "O valor pago não pode ser maior que o total.",
      }
    }

    // 6. Deriva status (reusa o helper)
    const status = deriveChargeStatus({
      status: charge.status,
      paidAmount,
      total,
      dueDate: charge.dueDate,
    })

    const isPaid = status === "PAID"

    // 7. Atualiza Charge
    const updatedCharge = await db.charge.update({
      where: { id: charge.id },
      data: {
        status,
        discount: discount.toFixed(2),
        total: total.toFixed(2),
        paidAmount: paidAmount.toFixed(2),
        paymentMethod: validatedData.paymentMethod ?? null,
        notes: validatedData.notes ?? null,
        paidAt: isPaid ? new Date() : null,
        paidById: isPaid ? session.user.id : null,
      },
    })

    // 8. Revalida paths
    revalidatePath("/dashboard/financeiro")

    // 9. Retorna serializado
    return {
      success: true,
      message: isPaid ? "Pagamento registrado!" : "Cobrança atualizada!",
      data: serialize(updatedCharge),
    }
  } catch (error) {
    console.error("❌ Erro ao gerenciar cobrança:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { success: false, error: "Cobrança não encontrada." }
      }
    }

    return {
      success: false,
      error: "Ocorreu um erro ao atualizar a cobrança.",
    }
  }
}
