import { db } from "@/lib/prisma"
import { Prisma } from "@misael1981/physio-database"

export async function getTreatments() {
  try {
    const treatments = await db.treatment.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        description: true,
        about: true,
        attendanceInfo: true,
        durationMinWeeks: true,
        durationMaxWeeks: true,
        sessionsPerWeekMin: true,
        sessionsPerWeekMax: true,
        sessionDurationMinutes: true,
        defaultPricePerSession: true,
        benefits: true,
      },
    })

    // Convert Decimal objects to numbers (or null) for each treatment
    const normalized = treatments.map((treatment) => ({
      ...treatment,
      defaultPricePerSession:
        treatment.defaultPricePerSession?.toNumber?.() ?? null,
    }))

    return normalized
  } catch (error) {
    console.error("Erro ao buscar os tratamentos:", error)
    throw new Error("Não foi possível carregar os tratamentos.")
  }
}

export type TreatmentForAnamnesisType = Prisma.TreatmentGetPayload<{
  select: {
    id: true
    name: true
  }
}>

export async function getTreatmentForAnamnesis() {
  try {
    const treatments = await db.treatment.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    })

    return treatments
  } catch (error) {
    console.error("Erro ao buscar os tratamentos:", error)
    throw new Error("Não foi possível carregar os tratamentos.")
  }
}

export type PatientTreatmentType = Prisma.PatientTreatmentGetPayload<{
  select: {
    id: true
    status: true
    treatment: {
      select: {
        id: true
        name: true
      }
    }
  }
}>

export async function getTreatmentsByPatientId(patientId: string) {
  try {
    const treatments = await db.patientTreatment.findMany({
      where: {
        patientId,
      },
      select: {
        id: true,
        status: true,
        treatment: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return treatments
  } catch (error) {
    console.error("Erro ao buscar os tratamentos do paciente:", error)
    return []
  }
}
