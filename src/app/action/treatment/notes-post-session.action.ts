"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type UpdateNotesParams = {
  sessionId: string
  notes: string | null
  patientId: string
}

export async function updateNotesPostSessions({
  sessionId,
  notes,
  patientId,
}: UpdateNotesParams) {
  try {
    await db.evolution.update({
      where: {
        id: sessionId,
      },
      data: {
        notesPostSesions: notes && notes.trim() === "" ? null : notes,
      },
    })

    revalidatePath(`/dashboard/pacientes/${patientId}?tab=evolutions`)

    return { success: true, message: "Nota salva com sucesso!" }
  } catch (error) {
    console.log("Erro ao salvar nota pós-consulta:", error)
    return {
      success: false,
      message: "Erro ao salvar a anotação. Tente novamente.",
    }
  }
}

export async function deleteNotesPostSessions(id: string, patientId: string) {
  try {
    if (!id) {
      return { success: false, message: "ID da sessão não informado." }
    }

    await db.evolution.update({
      where: { id },
      data: {
        notesPostSesions: null,
      },
    })

    revalidatePath(`/dashboard/pacientes/${patientId}?tab=evolutions`)

    return { success: true, message: "Nota deletada com sucesso!" }
  } catch (error) {
    console.log("Erro ao limpar nota pós-consulta:", error)
    return {
      success: false,
      message: "Erro ao deletar a anotação. Tente novamente.",
    }
  }
}
