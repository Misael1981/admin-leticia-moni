"use server"

import { AppointmentStatus } from "@/constants/enums"
import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function consolidateDailyAppointments() {
  try {
    const now = new Date()

    const result = await db.appointment.updateMany({
      where: {
        endTime: {
          lt: now,
        },
        status: {
          in: [
            AppointmentStatus.SCHEDULED,
            AppointmentStatus.CONFIRMED,
            AppointmentStatus.IN_PROGRESS,
          ],
        },
      },
      data: {
        status: AppointmentStatus.COMPLETED,
      },
    })

    revalidatePath("/dashboard/agenda")

    return {
      success: true,
      count: result.count,
      message: `${result.count} consulta(s) consolidada(s) como Concluída(s).`,
    }
  } catch (error) {
    console.error("Erro ao consolidar agendamentos diários:", error)
    return {
      success: false,
      error: "Falha ao consolidar o fechamento diário da agenda.",
    }
  }
}
