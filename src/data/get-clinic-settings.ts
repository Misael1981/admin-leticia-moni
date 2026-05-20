import { db } from "@/lib/prisma"

export async function getClinicSettings() {
  try {
    const settings = await db.clinic.findFirst()

    if (!settings) {
      return {
        id: "",
        name: "",
        whatsapp: "",
        phone: "",
        email: "",
        avatarImageUrl: "",
        coverImageUrl: "",
        slogan: "",
        socialMedia: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
      }
    }

    return settings
  } catch (error) {
    console.error("Erro ao buscar informações da clínica:", error)
    throw new Error("Não foi possível carregar as configurações.")
  }
}
