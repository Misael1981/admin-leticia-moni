import { MAIN_CLINIC_ID } from "@/constants/clinic"
import { db } from "@/lib/prisma"

export async function getClinicData() {
  try {
    const clinicData = await db.clinic.findUnique({
      where: {
        id: MAIN_CLINIC_ID,
      },
      select: {
        id: true,

        treatments: {
          select: {
            id: true,
            name: true,
            sessionDurationMinutes: true,
          },
          orderBy: {
            name: "asc",
          },
        },

        // Traz apenas os fisioterapeutas com ID e Nome
        physiotherapists: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        },

        // Traz apenas os pacientes com ID e Nome
        patients: {
          select: {
            id: true,
            name: true,
            evolution: {
              select: {
                sessionNumber: true,
              },
            },
            treatments: {
              select: {
                treatment: {
                  select: {
                    id: true,
                    name: true,
                    sessionDurationMinutes: true,
                  },
                },
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    })

    if (!clinicData) {
      throw new Error("Clínica principal não encontrada.")
    }

    return clinicData
  } catch (error) {
    console.error("ERRO_GET_CLINIC_DATA:", error)
    throw new Error("Não foi possível carregar os dados da clínica.")
  }
}
