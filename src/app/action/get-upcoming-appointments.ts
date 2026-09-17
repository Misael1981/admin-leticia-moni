"use server"

import { AppointmentStatus } from "@/constants/enums"
import { db } from "@/lib/prisma"
import { Prisma } from "@misael1981/physio-database"

// 1. Define a estrutura exata do include
const upcomingAppointmentInclude = {
  patient: { select: { name: true, id: true } },
  treatment: { select: { name: true } },
} satisfies Prisma.AppointmentInclude

// 2. Extrai o tipo exato que o Prisma gera COM os relacionamentos
export type UpcomingAppointment = Prisma.AppointmentGetPayload<{
  include: typeof upcomingAppointmentInclude
}>

export type UpcomingAppointmentsResult =
  | { success: true; data: UpcomingAppointment[] }
  | { success: false; error: string }

export async function getUpcomingAppointments(
  limit = 5,
): Promise<UpcomingAppointmentsResult> {
  try {
    const now = new Date()
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const appointments = await db.appointment.findMany({
      where: {
        startTime: {
          gte: now,
          lte: endOfDay,
        },
        status: {
          notIn: [AppointmentStatus.CANCELED, AppointmentStatus.NO_SHOW],
        },
      },
      include: upcomingAppointmentInclude,
      orderBy: {
        startTime: "asc",
      },
      take: limit,
    })

    return { success: true, data: appointments }
  } catch (error) {
    console.error("Erro ao buscar próximos atendimentos:", error)
    return { success: false, error: "Erro ao carregar próximos atendimentos." }
  }
}
