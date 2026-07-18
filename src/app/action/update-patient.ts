"use server"

import { db } from "@/lib/prisma"

export async function createPatient(data: any) {
  try {
    // Garanta que se o CPF vier vazio por qualquer motivo, vai pro banco como null de verdade
    const cpfToSave = data.cpf && data.cpf.trim() !== "" ? data.cpf : null

    await db.patient.create({
      data: {
        name: data.name,
        cpf: cpfToSave, // Grava null ou os 11 dígitos limpos
        // ... outros campos
      },
    })

    return { success: true }
  } catch (error) {
    // Tratamento amigável para quando tentarem cadastrar um CPF que já existe
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "Este CPF já está cadastrado para outro paciente.",
        }
      }
    }
    return { success: false, error: "Erro ao cadastrar paciente." }
  }
}
