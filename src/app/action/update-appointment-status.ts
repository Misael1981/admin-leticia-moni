"use server"

import { AppointmentStatus } from "@/constants/enums"
import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateAppointmentStatusSchema = z.object({
  id: z.string().min(1, "O ID do agendamento é obrigatório."),
  status: z.nativeEnum(AppointmentStatus),
})

type UpdateAppointmentStatusInput = z.infer<
  typeof updateAppointmentStatusSchema
>

export async function updateAppointmentStatus(
  input: UpdateAppointmentStatusInput,
) {
  try {
    const { id, status } = updateAppointmentStatusSchema.parse(input)

    const updatedAppointment = await db.appointment.update({
      where: { id },
      data: { status },
    })

    revalidatePath("/dashboard/agenda")

    return {
      success: true,
      data: updatedAppointment,
      message: "Status atualizado com sucesso!",
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.message,
      }
    }

    console.error("Erro ao atualizar status do agendamento:", error)
    return {
      success: false,
      error:
        "Não foi possível atualizar o status da consulta. Tente novamente.",
    }
  }
}
