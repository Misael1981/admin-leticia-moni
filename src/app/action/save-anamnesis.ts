"use server"

import { db } from "@/lib/prisma"
import { AnamnesisFormInput } from "@/schemas/patients-schemas"
import { revalidatePath } from "next/cache"

export async function saveAnamnesisAndAssessmentAction(
  patientId: string,
  data: AnamnesisFormInput,
) {
  // 1. Separamos o physicalAssessment E os treatmentIds da anamnesisData
  const { physicalAssessment, treatmentIds, ...anamnesisData } = data

  try {
    await db.$transaction(async (tx) => {
      // 📝 2. Upsert da Anamnese
      await tx.anamnesis.upsert({
        where: { patientId },
        update: {
          ...anamnesisData,
          examUrls: anamnesisData.examUrls || [],
          examPublicIds: anamnesisData.examPublicIds || [],
        },
        create: {
          ...anamnesisData,
          patientId,
          examUrls: anamnesisData.examUrls || [],
          examPublicIds: anamnesisData.examPublicIds || [],
        },
      })

      // 🩺 3. Vincular Tratamentos ao Paciente (caso tenham sido selecionados)
      if (treatmentIds && treatmentIds.length > 0) {
        // Cria os vinculos de tratamento caso ainda não existam
        await tx.patientTreatment.createMany({
          data: treatmentIds.map((treatmentId) => ({
            patientId,
            treatmentId,
            status: "ACTIVE",
          })),
          skipDuplicates: true, // Evita erro se o tratamento já estiver vinculado
        })
      }

      // 📋 4. Avaliação Física (Upsert para não duplicar se já existir)
      if (physicalAssessment) {
        // 1. Procura se o paciente já tem alguma avaliação
        const existingAssessment = await tx.physicalAssessment.findFirst({
          where: { patientId },
        })

        if (existingAssessment) {
          // 2. Se já existe, atualiza pelo ID da avaliação
          await tx.physicalAssessment.update({
            where: { id: existingAssessment.id }, // 👈 usa o 'id' único da avaliação
            data: { content: physicalAssessment },
          })
        } else {
          // 3. Se não existe, cria uma nova
          await tx.physicalAssessment.create({
            data: {
              patientId,
              content: physicalAssessment,
            },
          })
        }
      }
    })

    // 🔄 5. Revalidação do Cache
    revalidatePath(`/dashboard/pacientes/${patientId}`)

    return {
      success: true,
      message: "Anamnese e Avaliação salvas com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao salvar anamnese:", error)
    return {
      success: false,
      error: "Falha ao salvar os dados da anamnese.",
    }
  }
}
