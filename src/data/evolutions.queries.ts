import { Prisma } from "@misael1981/physio-database"
import { serialize, Serialized } from "@/helpers/serialize"
import { db } from "@/lib/prisma"

const evolutionInclude = Prisma.validator<Prisma.EvolutionInclude>()({
  prescriptions: {
    include: { video: true },
  },
  images: {
    select: {
      id: true,
      imageUrl: true,
      fileKey: true,
      name: true,
      description: true,
    },
  },
})

type EvolutionRaw = Prisma.EvolutionGetPayload<{
  include: typeof evolutionInclude
}>

export type EvolutionType = Serialized<EvolutionRaw>

export async function getEvolutionsByPatientId(patientId: string) {
  try {
    const evolutions = await db.evolution.findMany({
      where: { patientId },
      orderBy: { sessionNumber: "desc" },
      include: evolutionInclude, // <- reusa
    })

    return evolutions.map(serialize) as EvolutionType[]
  } catch (error) {
    console.error("Erro ao buscar Evoluções:", error)
    return []
  }
}
