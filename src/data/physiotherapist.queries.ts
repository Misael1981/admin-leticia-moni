import { db } from "@/lib/prisma"

export async function getPhysiotherapists() {
  try {
    const physiotherapists = await db.physiotherapist.findMany({
      orderBy: { name: "asc" },
    })

    return physiotherapists
  } catch (error) {
    console.error("Erro ao buscar fisioterapeutas:", error)
    throw new Error("Não foi possível carregar os fisioterapeutas.")
  }
}
