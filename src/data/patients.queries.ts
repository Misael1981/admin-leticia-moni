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

interface GetPatientByIdProps {
  id: string
}

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

export type PatientDetail = Prisma.PatientGetPayload<{
  include: {
    address: {
      select: {
        id: true
        street: true
        number: true
        complement: true
        district: true
        city: true
        state: true
        zipCode: true
      }
    }
  }
}>

export async function getPatientById({
  id,
}: GetPatientByIdProps): Promise<PatientDetail | null> {
  try {
    if (!id) {
      throw new Error("O ID do paciente é obrigatório.")
    }

    const patient = await db.patient.findUnique({
      where: { id },
      include: {
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
      },
    })

    return patient
  } catch (error) {
    console.error(`Erro ao buscar o paciente com ID ${id}:`, error)
    throw new Error("Não foi possível carregar as informações do paciente.")
  }
}

export type AnamnesesType = Prisma.AnamnesisGetPayload<{
  select: {
    id: true
    mainComplaint: true
    medicalDiagnosis: true
    accompanyingStaff: true
    complementaryExams: true
    hma: true
    additionalSymptoms: true
    preExistingConditions: true
    complaintMedications: true
    continuousMedications: true
  }
}>

export async function getAnamnesisByPatientId(patientId: string) {
  try {
    const anamnesis = await db.anamnesis.findUnique({
      where: { patientId },
    })
    return anamnesis
  } catch (error) {
    console.error("Erro ao buscar anamnese:", error)
    return null
  }
}

export type PhysicalAssessmentType = Prisma.PhysicalAssessmentGetPayload<{
  select: {
    id: true
    createdAt: true
    updatedAt: true
    patientId: true
    content: true
  }
}>

export async function getPhysicalAssessmentPatientId(patientId: string) {
  try {
    const physicalAssessment = await db.physicalAssessment.findFirst({
      where: { patientId },
    })

    return physicalAssessment
  } catch (error) {
    console.error("Erro ao buscar avaliação física:", error)
    return null
  }
}

export type EvolutionType = Prisma.EvolutionGetPayload<{
  select: {
    id: true
    createdAt: true
    updatedAt: true
    notes: true
    patientId: true
    sessionDate: true
    sessionNumber: true
    painScore: true
  }
}>

export async function getEvolutionsByPatientId(patientId: string) {
  try {
    const evolutions = await db.evolution.findMany({
      where: { patientId },
      orderBy: {
        sessionNumber: "desc", // Traz a sessão mais recente no topo! (Ex: #12, #11, #10...)
      },
    })

    return evolutions
  } catch (error) {
    console.error("Erro ao buscar Evoluções:", error)
    return []
  }
}
