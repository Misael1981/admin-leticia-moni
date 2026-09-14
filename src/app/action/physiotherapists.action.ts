"use server"

import { db } from "@/lib/prisma"
import {
  createPhysiotherapistSchema,
  PhysiotherapistFormInput,
} from "@/schemas/physiotherapist.schemas"
import { revalidatePath } from "next/cache"

export async function createPhysiotherapistAction(
  data: PhysiotherapistFormInput,
  clinicId: string,
) {
  try {
    if (!clinicId) {
      return {
        success: false,
        error: "Clínica não identificada.",
      }
    }

    const validatedFields = createPhysiotherapistSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Dados inválidos fornecidos.",
      }
    }

    const { name, phone, imageUrl, description, crefito } = validatedFields.data

    await db.physiotherapist.create({
      data: {
        name,
        phone: phone || null,
        imageUrl: imageUrl || null,
        description: description || null,
        crefito: crefito || null,
        clinicId,
      },
    })

    revalidatePath("/dashboard/profissionais")

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("ERRO_CREATE_PHYSIOTHERAPIST_ACTION:", error)
    return {
      success: false,
      error: "Ocorreu um erro interno ao cadastrar o fisioterapeuta.",
    }
  }
}
