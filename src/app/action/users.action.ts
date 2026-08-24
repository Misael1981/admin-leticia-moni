"use server"

import { db } from "@/lib/prisma"
import { CreateUserInput, createUserSchema } from "@/schemas/users-schemas"
import { revalidatePath } from "next/cache"

export async function deleteUser(id: string) {
  try {
    if (!id) {
      return { success: false, error: "ID do usuário não informado." }
    }

    await db.user.delete({
      where: { id },
    })

    revalidatePath("/dashboard/usuarios")

    return {
      success: true,
      message: "Usuário deletado com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao deletar usuário", error)
  }
}

export async function createUserAction(data: CreateUserInput) {
  try {
    const validatedFields = createUserSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Dados inválidos fornecidos.",
      }
    }

    const { name, email, phone, role, image } = validatedFields.data

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: "Já existe um usuário cadastrado com este e-mail.",
      }
    }

    await db.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        role,
        image: image || null,
      },
    })

    revalidatePath("/dashboard/usuarios")

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("ERRO_CREATE_USER_ACTION:", error)
    return {
      success: false,
      error: "Ocorreu um erro interno ao cadastrar o usuário.",
    }
  }
}

export async function updateUserAction(id: string, data: CreateUserInput) {
  try {
    if (!id) {
      return {
        success: false,
        error: "ID do usuário não fornecido.",
      }
    }

    const validatedFields = createUserSchema.safeParse(data)

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Dados inválidos fornecidos.",
      }
    }

    const { name, email, phone, role, image } = validatedFields.data

    const existingEmailUser = await db.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    })

    if (existingEmailUser) {
      return {
        success: false,
        error: "Este e-mail já está sendo utilizado por outro usuário.",
      }
    }

    await db.user.update({
      where: { id },
      data: {
        name,
        email,
        phone: phone || null,
        role,
        image: image || null,
      },
    })

    revalidatePath("/dashboard/usuarios")

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error("ERRO_UPDATE_USER_ACTION:", error)
    return {
      success: false,
      error: "Ocorreu um erro interno ao atualizar o usuário.",
    }
  }
}
