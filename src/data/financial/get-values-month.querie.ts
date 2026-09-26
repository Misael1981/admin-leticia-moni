import { db } from "@/lib/prisma"

export async function getFinancialSummary() {
  const now = new Date()

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0,
  )
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  )

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  )

  try {
    const [received, pending, overdue] = await Promise.all([
      db.charge.aggregate({
        where: {
          status: "PAID",
          paidAt: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { total: true },
      }),

      db.charge.aggregate({
        where: {
          status: "OPEN",
          dueDate: { gte: startOfToday, lte: endOfMonth },
        },
        _sum: { total: true },
      }),

      db.charge.aggregate({
        where: {
          status: "OPEN",
          dueDate: { lt: startOfToday },
        },
        _sum: { total: true },
      }),
    ])

    const totalReceived = Number(received._sum.total ?? 0)
    const totalPending = Number(pending._sum.total ?? 0)
    const totalOverdue = Number(overdue._sum.total ?? 0)

    const monthlyTotal = totalReceived + totalPending

    return {
      received: totalReceived,
      pending: totalPending,
      overdue: totalOverdue,
      monthlyTotal,
    }
  } catch (error) {
    console.error("Error fetching financial summary for current month:", error)
    return { received: 0, pending: 0, overdue: 0, monthlyTotal: 0 }
  }
}
