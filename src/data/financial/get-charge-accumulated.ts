import { serialize, Serialized } from "@/helpers/serialize"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { BillingMode, Prisma } from "@misael1981/physio-database"
import { getServerSession } from "next-auth"

const accumulatedOpenItemSelect = () =>
  ({
    id: true,
    amount: true,
    adjustedAmount: true,
    adjustmentReason: true,
    description: true,
    isReturn: true,
    chargeId: true,
    createdAt: true,
    evolution: {
      select: {
        id: true,
        sessionDate: true,
        sessionNumber: true,
      },
    },
    patient: {
      select: {
        id: true,
        name: true,
        phone: true,
        billingDay: true,
        defaultSessionPrice: true,
      },
    },
  }) satisfies Prisma.ChargeItemSelect

export type AccumulatedOpenItem = Prisma.ChargeItemGetPayload<{
  select: ReturnType<typeof accumulatedOpenItemSelect>
}>
export type SerializedAccumulatedOpenItem = Serialized<AccumulatedOpenItem>

export async function getAccumulatedOpenItems() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("UNAUTHENTICATED")
  }

  const items = await db.chargeItem.findMany({
    where: {
      chargeId: null,
      isReturn: false,
      patient: {
        billingMode: BillingMode.ACCUMULATED,
      },
    },
    select: accumulatedOpenItemSelect(),
    orderBy: [
      { patient: { name: "asc" } },
      { evolution: { sessionDate: "asc" } },
    ],
  })

  return serialize(items)
}
