import { db } from "@/lib/prisma"
import { Prisma } from "@misael1981/physio-database"

interface GetPatientByIdProps {
  id: string
}

export const patientDetailInclude = Prisma.validator<Prisma.PatientInclude>()({
  address: {
    select: {
      id: true,
      street: true,
      number: true,
      complement: true,
      district: true,
      city: true,
      state: true,
      zipCode: true,
    },
  },
  treatments: {
    include: {
      treatment: {
        select: {
          id: true,
          name: true,
          slug: true,
          sessionDurationMinutes: true,
          durationMinWeeks: true,
          durationMaxWeeks: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  },
  testimonial: {
    select: {
      id: true,
      isPublished: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  },
})

export type PatientDetail = Prisma.PatientGetPayload<{
  include: typeof patientDetailInclude
}>

export type PatientDetailWithNumericPrice = Omit<
  PatientDetail,
  "defaultSessionPrice"
> & {
  defaultSessionPrice: number | null
}

export async function getPatientById({
  id,
}: GetPatientByIdProps): Promise<PatientDetailWithNumericPrice | null> {
  try {
    if (!id) {
      throw new Error("O ID do paciente é obrigatório.")
    }

    const patient = await db.patient.findUnique({
      where: { id },
      include: patientDetailInclude,
    })

    if (!patient) return null

    const mappedPatient: PatientDetailWithNumericPrice = {
      ...patient,
      defaultSessionPrice: patient.defaultSessionPrice?.toNumber() ?? null,
    }

    return mappedPatient
  } catch (error) {
    console.error(`Erro ao buscar o paciente com ID ${id}:`, error)
    throw new Error("Não foi possível carregar as informações do paciente.")
  }
}
