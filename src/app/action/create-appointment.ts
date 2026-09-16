"use server"

import { revalidatePath } from "next/cache"
import {
  CreateAppointmentInput,
  createAppointmentSchema,
} from "@/schemas/appointment.schema"
import { db } from "@/lib/prisma"

export async function createAppointmentAction(data: CreateAppointmentInput) {
  try {
    const validatedData = createAppointmentSchema.parse(data)

    const hasConflict = await db.appointment.findFirst({
      where: {
        physiotherapistId: validatedData.physiotherapistId,
        status: { not: "CANCELED" },
        OR: [
          {
            startTime: { lte: validatedData.startTime },
            endTime: { gt: validatedData.startTime },
          },
          {
            startTime: { lt: validatedData.endTime },
            endTime: { gte: validatedData.endTime },
          },
        ],
      },
    })

    if (hasConflict) {
      return {
        success: false,
        error:
          "O profissional já possui um agendamento nesse intervalo de horário.",
      }
    }

    const appointment = await db.appointment.create({
      data: {
        clinicId: validatedData.clinicId,
        patientId: validatedData.patientId,
        physiotherapistId: validatedData.physiotherapistId,
        treatmentId: validatedData.treatmentId,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        status: validatedData.status ?? "SCHEDULED",
        sessionNumber: validatedData.sessionNumber,
        notes: validatedData.notes,
      },
    })

    revalidatePath("/dashboard/agenda")

    return {
      success: true,
      data: appointment,
    }
  } catch (error) {
    console.error("Erro na Server Action createAppointment:", error)
    return {
      success: false,
      error: "Ocorreu um erro interno ao salvar o agendamento.",
    }
  }
}
