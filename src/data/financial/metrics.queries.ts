import { db } from "@/lib/prisma"

export async function getMetricsForFinancial() {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const dateFilter = {
      gte: startOfDay,
      lte: endOfDay,
    }

    const [perSession, accumulated] = await Promise.all([
      db.evolution.aggregate({
        where: {
          sessionDate: dateFilter,
          patient: { billingMode: "PER_SESSION" },
        },
        _count: { _all: true },
        _sum: { pricePerSession: true },
      }),
      db.evolution.aggregate({
        where: {
          sessionDate: dateFilter,
          patient: { billingMode: "ACCUMULATED" },
        },
        _count: { _all: true },
        _sum: { pricePerSession: true },
      }),
    ])

    return {
      perSession: {
        count: perSession._count._all,
        totalValue: perSession._sum.pricePerSession ?? 0,
      },
      accumulated: {
        count: accumulated._count._all,
        totalValue: accumulated._sum.pricePerSession ?? 0,
      },
      totalEvolutionsToday: perSession._count._all + accumulated._count._all,
    }
  } catch (error) {
    console.error("Erro ao buscar métricas financeiras:", error)
    throw error
  }
}
