"use server"

import type { InputJsonValue } from "@misael1981/physio-database/generated-client/runtime/library"
import { db } from "@/lib/prisma"
import { BusinessHoursFormData } from "@/schemas/clinic-settings-schema"
import { revalidatePath } from "next/cache"

export async function updateBusinessHours(
  businessHoursData: BusinessHoursFormData,
) {
  try {
    const clinic = await db.clinic.findFirst()

    if (!clinic) {
      return {
        success: false,
        error:
          "Nenhuma clínica cadastrada foi encontrada para associar os horários.",
      }
    }

    const clinicId = clinic.id

    const businessHoursToCreate: Array<{
      clinicId: string
      dayOfWeek: number
      timeSlots: InputJsonValue
      isClosed: boolean
      displayOrder: number
    }> = businessHoursData.businessHours.map((bh) => ({
      clinicId,
      dayOfWeek: bh.dayOfWeek,
      timeSlots: bh.timeSlots,
      isClosed: bh.isClosed,
      displayOrder: bh.dayOfWeek,
    }))

    await db.$transaction([
      db.businessHours.deleteMany({
        where: { clinicId },
      }),

      db.businessHours.createMany({
        data: businessHoursToCreate,
      }),
    ])

    revalidatePath("/dashboard/info-clinica")

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar horários:", error)
    return {
      success: false,
      error: "Falha ao salvar os horários de funcionamento.",
    }
  }
}
