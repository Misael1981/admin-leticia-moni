"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type DataProps = {
  avatarImageUrl: string
  coverImageUrl: string
  slogan?: string

  socialMedia?: {
    instagram?: string
    facebook?: string
    linkedin?: string
  }
}

export async function saveClinicProfile(data: DataProps) {
  try {
    const avatarUrl = data.avatarImageUrl || ""
    const coverUrl = data.coverImageUrl || ""

    const updatedProfileClinic = await db.clinic.upsert({
      where: {
        id: "main-clinic",
      },
      update: {
        slogan: data.slogan,
        avatarImageUrl: avatarUrl,
        coverImageUrl: coverUrl,
        socialMedia: data.socialMedia || {},
      },
      create: {
        id: "main-clinic",
        slogan: data.slogan || "",
        avatarImageUrl: avatarUrl,
        coverImageUrl: coverUrl,
        socialMedia: data.socialMedia || {},
      },
    })

    revalidatePath("/dashboard/info-clinica")

    return { success: true, clinic: updatedProfileClinic }
  } catch (error) {
    console.error("Erro ao salvar dados da clínica:", error)
    return { success: false, error: "Falha ao salvar as configurações." }
  }
}
