import { serialize } from "@/helpers/serialize"
import { db } from "@/lib/prisma"
import { BillingMode } from "@misael1981/physio-database"

export async function getChargeItemPerSession() {
  try {
    const chargeItemPerSession = await db.chargeItem.findMany({
      where: {
        chargeId: null, // só o que tá em aberto
        patient: {
          billingMode: BillingMode.PER_SESSION,
        },
      },
      select: {
        id: true,
        amount: true,
        evolution: {
          select: {
            id: true,
            sessionDate: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        charge: {
          select: {
            id: true,
            status: true,
            subtotal: true,
            discount: true,
            total: true,
            dueDate: true,
            paidAt: true,
            canceledAt: true,
            paymentMethod: true,
            notes: true,
          },
        },
      },
    })

    return serialize(chargeItemPerSession)
  } catch (error) {
    console.error("Erro ao buscar consultas por sessão:", error)
    throw error
  }
}
