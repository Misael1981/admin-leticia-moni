"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type DataProps = {
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  zipCode: string | null
}

export async function saveClinicAddress(data: DataProps) {
  try {
    const updatedAddressClinic = await db.clinic.upsert({
      where: {
        id: "main-clinic",
      },
      update: {
        street: data.street || null,
        number: data.number || null,
        complement: data.complement || null,
        neighborhood: data.neighborhood || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,
      },
      create: {
        id: "main-clinic",
        street: data.street || null,
        number: data.number || null,
        complement: data.complement || null,
        neighborhood: data.neighborhood || null,
        city: data.city || null,
        state: data.state || null,
        zipCode: data.zipCode || null,

        name: "",
        whatsapp: "",
        phone: "",
        email: "",

        slogan: "",
        avatarImageUrl: "",
        coverImageUrl: "",
      },
    })

    revalidatePath("/dashboard/info-clinica")

    return { success: true, clinic: updatedAddressClinic }
  } catch (error) {
    console.error("Erro ao salvar dados da clínica:", error)
    return { success: false, error: "Falha ao salvar as configurações." }
  }
}
