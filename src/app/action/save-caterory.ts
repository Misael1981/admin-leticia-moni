"use server"

import { deleteImagesFromCloudinary } from "@/lib/cloudinary"
import { db } from "@/lib/prisma"
import { categorySchema } from "@/schemas/categories-products-schema"
import { revalidatePath } from "next/cache"

export async function saveCategory(formData: FormData) {
  try {
    const id = formData.get("id") as string | null
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    const validatedFields = categorySchema.safeParse({
      name,
      description,
    })

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Dados inválidos.",
        details: validatedFields.error.flatten().fieldErrors,
      }
    }

    const { name: validatedName, description: validatedDescription } =
      validatedFields.data

    await db.category.upsert({
      where: {
        id: id || "CREATE_NEW_CATEGORY",
      },
      update: {
        name: validatedName,
        description: validatedDescription || null,
        clinicId: "main-clinic",
      },
      create: {
        name: validatedName,
        description: validatedDescription || null,
        clinicId: "main-clinic",
      },
    })

    revalidatePath("/dashboard/loja")

    return {
      success: true,
      message: id ? "Categoria atualizada!" : "Categoria criada!",
    }
  } catch (error) {
    console.error("Erro ao salvar categoria no servidor:", error)
    return {
      success: false,
      error: "Falha ao salvar a categoria no banco de dados.",
    }
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    if (!categoryId) {
      return { success: false, error: "ID da categoria é inválido." }
    }

    const productsInCategory = await db.productImage.findMany({
      where: {
        product: {
          categoryId: categoryId,
        },
      },
      select: {
        url: true,
      },
    })

    if (productsInCategory.length > 0) {
      const urlsToDelete = productsInCategory.map((img) => img.url)
      await deleteImagesFromCloudinary(urlsToDelete)
    }

    await db.category.delete({
      where: {
        id: categoryId,
      },
    })

    revalidatePath("/dashboard/loja")

    return {
      success: true,
      message: "Categoria e todos os seus produtos vinculados foram removidos!",
    }
  } catch (error) {
    console.error("Erro ao deletar categoria no servidor:", error)
    return {
      success: false,
      error:
        "Falha ao deletar a categoria. Verifique se existem produtos dependentes sem cascata configurada.",
    }
  }
}
