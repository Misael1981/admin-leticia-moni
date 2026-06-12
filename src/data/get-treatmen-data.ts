import { db } from "@/lib/prisma"

export async function getTreatmentData({
  treatmentId,
}: {
  treatmentId: string
}) {
  try {
    const treatment = await db.treatment.findUnique({
      where: { id: treatmentId },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        description: true,
        about: true,
        attendanceInfo: true,
        durationMinWeeks: true,
        durationMaxWeeks: true,
        sessionsPerWeekMin: true,
        sessionsPerWeekMax: true,
        sessionDurationMinutes: true,
        benefits: true,
      },
    })

    return treatment
  } catch (error) {
    console.error("Erro ao buscar o tratamento:", error)
    throw new Error("Não foi possível carregar o tratamento.")
  }
}
