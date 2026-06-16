"use server"

import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleProductVisibility(
  productId: string,
  isActive: boolean,
) {
  try {
    if (!productId) {
      return { success: false, error: "ID do produto é obrigatório." }
    }

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        isActive,
      },
    })

    revalidatePath("/dashboard/loja")

    return {
      success: true,
      message: updatedProduct.isActive
        ? "Produto ativado!"
        : "Produto desativado!",
      product: {
        ...updatedProduct,
        price: updatedProduct.price.toNumber(),
      },
    }
  } catch (error) {
    console.error("ERRO_TOGGLE_VISIBILIDADE:", error)
    return {
      success: false,
      error: "Não foi possível alterar a visibilidade do produto.",
    }
  }
}
