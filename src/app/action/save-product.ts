"use server"

import { db } from "@/lib/prisma"
import {
  ProductFormInputValues,
  productSchema,
} from "@/schemas/categories-products-schema"
import { revalidatePath } from "next/cache"

interface SaveProductProps {
  categoryId?: string
  data: ProductFormInputValues & { id?: string | null }
}

export async function saveProduct({ categoryId, data }: SaveProductProps) {
  try {
    const validatedFields = productSchema.safeParse(data)

    if (!validatedFields.success) {
      return { success: false, error: "Dados do produto inválidos." }
    }

    const {
      name,
      description,
      indications,
      benefits,
      price,
      stock,
      sku,
      isActive,
      isFeatured,
      images,
    } = validatedFields.data

    const productId = data.id

    await db.product.upsert({
      where: {
        id: productId || "CREATE_NEW_PRODUCT",
      },
      // SE FOR UPDATE
      update: {
        name,
        description,
        indications,
        benefits,
        price,
        stock,
        sku,
        isActive,
        isFeatured,
        categoryId: categoryId,
        images: {
          deleteMany: {},
          create: images.map((img) => ({
            url: img.url,
          })),
        },
      },

      create: {
        name,
        description,
        indications,
        benefits,
        price,
        stock,
        sku,
        isActive,
        isFeatured,
        categoryId: categoryId!,
        clinicId: "main-clinic",
        images: {
          create: images.map((img) => ({
            url: img.url,
          })),
        },
      },
    })

    revalidatePath("/dashboard/loja")

    return {
      success: true,
      message: productId
        ? "Produto atualizado com sucesso!"
        : "Produto cadastrado com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao salvar produto no servidor:", error)
    return {
      success: false,
      error: "Falha ao salvar o produto no banco de dados.",
    }
  }
}
