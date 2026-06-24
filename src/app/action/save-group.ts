"use server"

import { deleteImagesFromCloudinary } from "@/lib/cloudinary"
import { db } from "@/lib/prisma"
import { productsGroupSchema } from "@/schemas/categories-products-schema"
import { revalidatePath } from "next/cache"

export async function saveGroup(formData: FormData) {
  try {
    const id = formData.get("id") as string | null
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const categoryId = formData.get("categoryId") as string

    const validatedFields = productsGroupSchema.safeParse({
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

    if (!categoryId) {
      return {
        success: false,
        error: "Selecione uma categoria antes de criar um grupo.",
      }
    }

    const { name: validatedName, description: validatedDescription } =
      validatedFields.data

    await db.productGroup.upsert({
      where: {
        id: id ?? "new",
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
        categoryId,
      },
    })

    revalidatePath("/dashboard/loja")

    return {
      success: true,
      message: id ? "Categoria atualizada!" : "Categoria criada!",
    }
  } catch (error) {
    console.error("Erro ao salvar grupo no servidor:", error)
    return {
      success: false,
      error: "Falha ao salvar a grupo no banco de dados.",
    }
  }
}

export async function deleteGroup(groupId: string) {
  try {
    if (!groupId) {
      return { success: false, error: "ID da categoria é inválido." }
    }

    const productsInCategory = await db.productImage.findMany({
      where: {
        product: {
          groupId: groupId,
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

    await db.productGroup.delete({
      where: {
        id: groupId,
      },
    })

    revalidatePath("/dashboard/loja")

    return {
      success: true,
      message: "Grupo e todos os seus produtos vinculados foram removidos!",
    }
  } catch (error) {
    console.error("Erro ao deletar grupo no servidor:", error)
    return {
      success: false,
      error:
        "Falha ao deletar um grupo. Verifique se existem produtos dependentes sem cascata configurada.",
    }
  }
}
