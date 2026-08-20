import { calculateTrend } from "@/lib/metrics-utils"
import { db } from "@/lib/prisma"

export async function getMetricsOverview() {
  const now = new Date()

  // Datas para o Mês Atual
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Datas para o Mês Anterior (mesmo intervalo de dias)
  const startOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1,
  )
  const endOfPreviousMonthSameDay = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
  )

  try {
    const [
      // Totais
      totalPatients,
      activePatients,
      quantityProducts,

      // Evoluções / Atendimentos deste mês
      currentEvolutions,
      // Evoluções / Atendimentos do mês passado até o mesmo dia
      previousEvolutions,

      // Pacientes novos deste mês
      currentNewPatients,
      // Pacientes novos do mês passado
      previousNewPatients,
    ] = await Promise.all([
      db.patient.count(),
      db.patient.count({ where: { status: "ACTIVE" } }),
      db.product.count(),

      // Atendimentos mês atual
      db.evolution.count({
        where: {
          sessionDate: { gte: startOfCurrentMonth },
        },
      }),
      // Atendimentos mês passado
      db.evolution.count({
        where: {
          sessionDate: {
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonthSameDay,
          },
        },
      }),

      // Pacientes criados este mês
      db.patient.count({
        where: { createdAt: { gte: startOfCurrentMonth } },
      }),
      // Pacientes criados mês passado
      db.patient.count({
        where: {
          createdAt: {
            gte: startOfPreviousMonth,
            lte: endOfPreviousMonthSameDay,
          },
        },
      }),
    ])

    // Calcula as tendências automáticas
    const evolutionsTrend = calculateTrend(
      currentEvolutions,
      previousEvolutions,
    )
    const patientsTrend = calculateTrend(
      currentNewPatients,
      previousNewPatients,
    )

    return {
      totalPatients: {
        value: totalPatients,
        ...patientsTrend,
      },
      activePatients: {
        value: activePatients,
        trend: "neutral" as const,
        trendValue: "0%",
      },
      evolutionsMonth: {
        value: currentEvolutions,
        ...evolutionsTrend,
      },
      quantityProducts: {
        value: quantityProducts,
        trend: "neutral" as const,
        trendValue: "0%",
      },
    }
  } catch (error) {
    console.error("Erro ao carregar métricas da dashboard:", error)
    throw new Error("Não foi possível carregar as métricas.")
  }
}
