"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface SaveTreatmentInput {
  id?: string
  name: string
  slug: string
  imageUrl?: string

  description?: string
  about: string | undefined
  attendanceInfo: string | undefined
  benefits: string[]

  durationMinWeeks: number | undefined
  durationMaxWeeks: number | undefined
  sessionsPerWeekMin: number | undefined
  sessionsPerWeekMax: number | undefined
  sessionDurationMinutes: number | undefined
}

export async function saveTreatment(data: SaveTreatmentInput) {
  try {
    const treatmentId = data.id || "new-treatment"

    const updatedTreatment = await db.treatment.upsert({
      where: {
        id: treatmentId,
      },
      update: {
        name: data.name,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        clinicId: "main-clinic",
        slug: data.slug,
        about: data.about || null,
        attendanceInfo: data.attendanceInfo || null,
        benefits: data.benefits || null,
        durationMinWeeks: data.durationMinWeeks || null,
        durationMaxWeeks: data.durationMaxWeeks || null,
        sessionsPerWeekMin: data.sessionsPerWeekMin || null,
        sessionsPerWeekMax: data.sessionsPerWeekMax || null,
        sessionDurationMinutes: data.sessionDurationMinutes || null,
      },
      create: {
        name: data.name,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        clinicId: "main-clinic",
        slug: data.slug,
        about: data.about || null,
        attendanceInfo: data.attendanceInfo || null,
        benefits: data.benefits || null,
        durationMinWeeks: data.durationMinWeeks || null,
        durationMaxWeeks: data.durationMaxWeeks || null,
        sessionsPerWeekMin: data.sessionsPerWeekMin || null,
        sessionsPerWeekMax: data.sessionsPerWeekMax || null,
        sessionDurationMinutes: data.sessionDurationMinutes || null,
      },
    })

    revalidatePath("/dashboard/tratamentos")
    revalidatePath("/")

    return { success: true, treatment: updatedTreatment }
  } catch (error) {
    console.error("Erro ao salvar tratamento:", error)
    return { success: false, error: "Falha ao salvar o tratamento no banco." }
  }
}
