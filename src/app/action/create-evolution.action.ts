"use server"

import { db } from "@/lib/prisma"
import {
  EvolutionFormValues,
  evolutionSchema,
} from "@/schemas/patients-schemas"
import { revalidatePath } from "next/cache"

type CreateEvolutionParams = {
  patientId: string
  nextSessionNumber: number
  data: EvolutionFormValues
}

export async function createEvolutionAction({
  patientId,
  nextSessionNumber,
  data,
}: CreateEvolutionParams) {
  try {
    const validatedData = evolutionSchema.parse(data)

    const result = await db.$transaction(async (tx) => {
      // 1. Atualiza status do paciente
      if (validatedData.patientStatus) {
        await tx.patient.update({
          where: { id: patientId },
          data: { status: validatedData.patientStatus },
        })
      }

      // (Opcional) Desativa prescrições ativas anteriores se esta sessão for a nova referência
      await tx.videoPrescription.updateMany({
        where: { patientId, isActive: true },
        data: { isActive: false },
      })

      // 2. Cria a Evolução + Vídeos da Sessão juntos!
      const newEvolution = await tx.evolution.create({
        data: {
          patientId,
          sessionNumber: nextSessionNumber,
          sessionDate: validatedData.sessionDate,
          painScore: validatedData.painScore,
          notes: validatedData.notes,

          // 🎯 O Prisma já injeta o ID da nova evolução automaticamente em cada prescrição!
          prescriptions: {
            create: validatedData.exerciseVideos.map((exercise, index) => ({
              patientId,
              videoId: exercise.videoId,
              order: index,
              sets: exercise.sets,
              reps: exercise.reps,
              holdTimeSec: exercise.holdTimeSec,
              frequency: exercise.frequency,
              isActive: true,
            })),
          },
        },
      })

      return newEvolution
    })

    revalidatePath(`/dashboard/patients/${patientId}`)

    return {
      success: true,
      message: "Evolução e prescrições salvas com sucesso!",
      data: result,
    }
  } catch (error) {
    console.error("❌ Erro ao salvar evolução:", error)
    return {
      success: false,
      error: "Ocorreu um erro ao salvar a evolução. Tente novamente.",
    }
  }
}
