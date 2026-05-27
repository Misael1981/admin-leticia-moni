import { db } from "@/lib/prisma"

export async function getTreatments() {
  try {
    const treatments = await db.treatment.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    })

    return treatments
  } catch (error) {
    console.error("Erro ao buscar os tratamentos:", error)
    throw new Error("Não foi possível carregar os tratamentos.")
  }
}
