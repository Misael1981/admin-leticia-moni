"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type DataProps = {
  id?: string
  name: string
  whatsapp?: string
  phone?: string
  email: string
}

export async function saveClinicContact(data: DataProps) {
  try {
    const updatedContactClinic = await db.clinic.upsert({
      where: {
        id: "main-clinic",
      },
      update: {
        name: data.name,
        whatsapp: data.whatsapp,
        phone: data.phone,
        email: data.email,
      },
      create: {
        id: "main-clinic",
        name: data.name,
        whatsapp: data.whatsapp,
        phone: data.phone,
        email: data.email,
      },
    })

    revalidatePath("/dashboard/info-clinica")

    return { success: true, clinic: updatedContactClinic }
  } catch (error) {
    console.error("Erro ao salvar dados da clínica:", error)
    return { success: false, error: "Falha ao salvar as configurações." }
  }
}
