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

export async function getRecentPatientsFromEvolutions() {
  try {
    // Busca as últimas evoluções trazidas com os dados do paciente
    const evolutions = await db.evolution.findMany({
      take: 20, // Pega uma margem maior para garantir 5 pacientes distintos
      orderBy: {
        sessionDate: "desc",
      },
      select: {
        id: true,
        sessionDate: true,
        patient: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
    })

    // Map auxiliar para guardar apenas a evolução mais recente por paciente (deduplicação)
    const uniquePatientsMap = new Map()

    for (const evo of evolutions) {
      if (!uniquePatientsMap.has(evo.patient.id)) {
        uniquePatientsMap.set(evo.patient.id, {
          id: evo.patient.id,
          name: evo.patient.name,
          nickname: evo.patient.nickname ?? "",
          createdAt: evo.sessionDate.toISOString(), // Usa a data da última sessão atendida
        })
      }

      // Se já achou 5 pacientes únicos, interrompe a busca
      if (uniquePatientsMap.size === 5) break
    }

    return Array.from(uniquePatientsMap.values())
  } catch (error) {
    console.error("Erro ao buscar últimos pacientes atendidos:", error)
    return []
  }
}

export type BirthdayPatient = {
  id: string
  name: string
  nickname: string | null
  phone: string | null
  birthDate: string
  isToday: boolean
  age: number
}

export async function getMonthBirthdayPatients(): Promise<BirthdayPatient[]> {
  try {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()

    const patients = await db.patient.findMany({
      where: {
        birthDate: {
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        nickname: true,
        phone: true,
        birthDate: true,
      },
    })

    const monthBirthdays = patients
      .filter((patient) => {
        if (!patient.birthDate) return false
        const bdate = new Date(patient.birthDate)
        return bdate.getMonth() === currentMonth
      })
      .map((patient) => {
        const bdate = new Date(patient.birthDate!)
        const isToday =
          bdate.getDate() === currentDay && bdate.getMonth() === currentMonth

        const age = today.getFullYear() - bdate.getFullYear()

        return {
          id: patient.id,
          name: patient.name,
          nickname: patient.nickname,
          phone: patient.phone,
          birthDate: patient.birthDate!.toISOString(),
          isToday,
          age,
        }
      })

    monthBirthdays.sort((a, b) => {
      if (a.isToday && !b.isToday) return -1
      if (!a.isToday && b.isToday) return 1

      const dayA = new Date(a.birthDate).getDate()
      const dayB = new Date(b.birthDate).getDate()
      return dayA - dayB
    })

    return monthBirthdays
  } catch (error) {
    console.error("Erro ao buscar aniversariantes do mês:", error)
    return []
  }
}
