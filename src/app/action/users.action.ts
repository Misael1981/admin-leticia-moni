"use server"

import { db } from "@/lib/prisma"
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
