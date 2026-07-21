"use server"

import { db } from "@/lib/prisma"
import { patientSchema } from "@/schemas/patients-schemas"
import { PatientReferralSource, Prisma } from "@misael1981/physio-database"
import { revalidatePath } from "next/cache"

export async function createPatient(formData: unknown) {
  const result = patientSchema.safeParse(formData)

  if (!result.success) {
    return {
      success: false,
      error: "Dados do formulário inválidos.",
      errors: result.error.flatten().fieldErrors,
    }
  }

  const data = result.data

  try {
    const newPatient = await db.$transaction(async (tx) => {
      const patient = await tx.patient.create({
        data: {
          name: data.name,
          nickname: data.nickname,
          avatarUrl: data.avatarUrl,
          biologicalSex: data.biologicalSex,
          gender: data.gender,
          birthDate: data.birthDate,
          nationality: data.nationality,
          birthCity: data.birthCity,
          birthState: data.birthState,
          cpf: data.cpf,
          rg: data.rg,
          profession: data.profession,
          maritalStatus: data.maritalStatus,
          education: data.education,
          phone: data.phone,
          email: data.email,
          emergencyContactName: data.emergencyContactName,
          emergencyContactPhone: data.emergencyContactPhone,

          hasInsurance: data.hasInsurance,
          insuranceName: data.insuranceName,
          insuranceNumber: data.insuranceNumber,
          patientSource: data.patientSource as PatientReferralSource,
          referralProfessional: data.referralProfessional,
          status: data.status,
          clinicId: "main-clinic",
        },
      })

      if (data.address && (data.address.street || data.address.zipCode)) {
        await tx.address.create({
          data: {
            zipCode: data.address.zipCode,
            street: data.address.street,
            number: data.address.number,
            complement: data.address.complement,
            district: data.address.district,
            city: data.address.city,
            state: data.address.state,
            patient: {
              connect: {
                id: patient.id,
              },
            },
          },
        })
      }

      return patient
    })

    revalidatePath("/dashboard/pacientes")

    return { success: true, patientId: newPatient.id }
  } catch (error: unknown) {
    console.error("Erro ao salvar paciente no banco:", error)

    const prismaError = error as {
      code?: string
      meta?: {
        target?: string[] | string
      }
    }

    if (
      prismaError.code === "P2002" &&
      JSON.stringify(prismaError.meta?.target).includes("cpf")
    ) {
      return {
        success: false,
        error: "Já existe um paciente cadastrado com este CPF.",
      }
    }

    return {
      success: false,
      error: "Falha interna ao salvar o paciente. Tente novamente.",
    }
  }
}

export async function deletePatient(id: string) {
  try {
    if (!id) {
      return { success: false, error: "ID do paciente não informado." }
    }

    await db.patient.delete({
      where: { id },
    })

    revalidatePath("/dashboard/pacientes")

    return {
      success: true,
      message: "Paciente deletado com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao deletar paciente:", error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        error:
          "Não é possível excluir: este paciente possui consultas ou prontuários vinculados.",
      }
    }

    return { success: false, error: "Falha ao deletar paciente no banco." }
  }
}
