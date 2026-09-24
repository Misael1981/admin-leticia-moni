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
    examUrls: true
    examPublicIds: true
  }
}>

export async function getAnamnesisByPatientId(patientId: string) {
  try {
    const anamnesis = await db.anamnesis.findUnique({
      where: { patientId },
      include: {},
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

export type PatientAuthType = Prisma.PatientAuthGetPayload<{
  select: {
    id: true
    createdAt: true
    patientId: true
    pinHash: true
    mustChangePin: true
    failedAttempts: true
    lockedUntil: true
    lastLoginAt: true
    createdBy: true
    tokenVersion: true
  }
}>

export async function getPatientAuth(
  patientId: string,
): Promise<PatientAuthType | null> {
  try {
    const patientAuth = await db.patientAuth.findUnique({
      where: { patientId },
      select: {
        id: true,
        createdAt: true,
        patientId: true,
        pinHash: true,
        mustChangePin: true,
        failedAttempts: true,
        lockedUntil: true,
        lastLoginAt: true,
        createdBy: true,
        tokenVersion: true,
      },
    })

    return patientAuth
  } catch (error) {
    console.error("Erro ao buscar patientAuth:", error)
    return null
  }
}
