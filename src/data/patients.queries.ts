import { db } from "@/lib/prisma"

export async function getAllPatients() {
  try {
    const patients = db.patient.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return patients
  } catch (error) {
    console.error("Erro ao buscar os pacientes:", error)
    throw new Error("Não foi possível carregar os pacientes.")
  }
}
