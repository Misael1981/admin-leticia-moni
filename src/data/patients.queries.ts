import { db } from "@/lib/prisma"
import { Prisma } from "@misael1981/physio-database"

interface GetPatientsProps {
  whereClause?: Prisma.PatientWhereInput
  currentPage: number
  ITEMS_PER_PAGE: number
}

export type PatientListItem = Prisma.PatientGetPayload<{
  select: {
    id: true
    name: true
    nickname: true
    status: true
    cpf: true
    phone: true
    avatarUrl: true
  }
}>

export async function getPatients({
  whereClause,
  currentPage,
  ITEMS_PER_PAGE,
}: GetPatientsProps): Promise<PatientListItem[]> {
  try {
    const patients = await db.patient.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      select: {
        id: true,
        name: true,
        nickname: true,
        status: true,
        cpf: true,
        phone: true,
        avatarUrl: true,
      },
    })

    return patients
  } catch (error) {
    console.error("Erro ao buscar os pacientes:", error)
    throw new Error("Não foi possível carregar os pacientes.")
  }
}

interface GetCountPatientsProps {
  whereClause?: Prisma.PatientWhereInput
}

export async function getCountPatients({
  whereClause,
}: GetCountPatientsProps): Promise<number> {
  try {
    const totalPatients = await db.patient.count({
      where: whereClause,
    })

    return totalPatients
  } catch (error) {
    console.error("Erro ao buscar quantidade de pacientes:", error)
    throw new Error("Não foi possível carregar quantidade de pacientes.")
  }
}
