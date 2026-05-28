"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface SaveTreatmentInput {
  id?: string
  name: string
  description?: string
  imageUrl?: string
  slug: string
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
      },
      create: {
        name: data.name,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        clinicId: "main-clinic",
        slug: data.slug,
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
