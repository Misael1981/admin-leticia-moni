"use server"

import { authOptions } from "@/lib/auth"
import { serialize } from "@/helpers/serialize"
import { db } from "@/lib/prisma"
import {
  EvolutionFormValues,
  evolutionSchema,
} from "@/schemas/patients-schemas"
import { Prisma } from "@misael1981/physio-database"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

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
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, error: "Não autenticado." }
  }

  const result = evolutionSchema.safeParse(data)
  if (!result.success) {
    return {
      success: false,
      error: "Dados inválidos.",
      errors: result.error.flatten().fieldErrors,
    }
  }
  const validatedData = result.data

  try {
    const newEvolution = await db.$transaction(async (tx) => {
      // 1. Atualiza status do paciente SE mudou
      const currentPatient = await tx.patient.findUnique({
        where: { id: patientId },
        select: { status: true },
      })
      if (currentPatient?.status !== validatedData.patientStatus) {
        await tx.patient.update({
          where: { id: patientId },
          data: { status: validatedData.patientStatus },
        })
      }

      // 2. Desativa prescrições antigas
      await tx.videoPrescription.updateMany({
        where: { patientId, isActive: true },
        data: { isActive: false },
      })

      // 3. Cria Evolution + ChargeItem (nested)
      const evolution = await tx.evolution.create({
        data: {
          patientId,
          sessionNumber: nextSessionNumber,
          sessionDate: validatedData.sessionDate,
          painScore: validatedData.painScore,
          pricePerSession: validatedData.pricePerSession.toFixed(2),
          notes: validatedData.notes,
          createdById: session.user.id,

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

          images: {
            createMany: {
              data: validatedData.images.map((img) => ({
                imageUrl: img.imageUrl,
                name: img.name,
                description: img.description,
                fileKey: img.fileKey,
              })),
            },
          },

          // ⭐ AQUI: ChargeItem nasce junto
          chargeItem: {
            create: {
              amount: validatedData.pricePerSession.toFixed(2),
              description: `Consulta - ${validatedData.sessionDate.toLocaleDateString("pt-BR")}`,
              patientId,
              clinicId: "main-clinic",
            },
          },
        },
      })

      return evolution
    })

    revalidatePath(`/dashboard/pacientes/${patientId}`)
    revalidatePath(`/dashboard/financeiro`)

    return {
      success: true,
      message: "Evolução e prescrições salvas com sucesso!",
      data: serialize(newEvolution),
    }
  } catch (error) {
    console.error("❌ Erro ao salvar evolução:", error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Já existe uma sessão com esse número. Recarregue a página.",
      }
    }

    return {
      success: false,
      error: "Ocorreu um erro ao salvar a evolução. Tente novamente.",
    }
  }
}
