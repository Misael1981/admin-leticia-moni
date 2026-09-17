"use server"

import { db } from "@/lib/prisma"

export async function getAppointmentBySelectedDate(selectedDate: Date) {
  try {
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const appointments = await db.appointment.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        physiotherapist: {
          select: {
            id: true,
            name: true,
          },
        },
        treatment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    })

    return { success: true, data: appointments }
  } catch (error) {
    console.error("Erro ao buscar agendamentos do dia:", error)
    return { success: false, error: "Erro ao carregar a agenda do dia." }
  }
}
