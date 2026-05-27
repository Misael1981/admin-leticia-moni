// src/actions/save-treatment.ts
"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface SaveTreatmentInput {
  id?: string // Opcional: se vier, é edição; se não, é cadastro
  name: string
  description?: string
  imageUrl?: string
  price: number // Adicionado como obrigatório para bater com o banco
}

export async function saveTreatment(data: SaveTreatmentInput) {
  try {
    // Definimos o ID do tratamento: ou o que veio para edição, ou um placeholder temporário para o Prisma ignorar no 'create'
    const treatmentId = data.id || "new-treatment"

    const updatedTreatment = await db.treatment.upsert({
      where: {
        id: treatmentId,
      },
      update: {
        name: data.name,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        // Mantém o vínculo com a clínica única do sistema
        clinicId: "main-clinic",
        price: data.price, // Incluído no update
      },
      create: {
        // Se for um cadastro novo, não passamos ID fixo para o Prisma usar o @default(uuid()) nativo do model
        name: data.name,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        clinicId: "main-clinic",
        price: data.price, // Incluído no create (o erro estava aqui!)
      },
    })

    // Renova o cache da listagem do admin e da Landing Page para atualizar na hora
    revalidatePath("/dashboard/tratamentos")
    revalidatePath("/")

    return { success: true, treatment: updatedTreatment }
  } catch (error) {
    console.error("Erro ao salvar tratamento:", error)
    return { success: false, error: "Falha ao salvar o tratamento no banco." }
  }
}
