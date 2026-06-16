"use server"

import { deleteImagesFromCloudinary } from "@/lib/cloudinary"
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

export async function deleteImages(productId: string) {
  if (!productId) return

  const productImages = await db.productImage.findMany({
    where: { productId },
    select: { url: true },
  })

  if (productImages.length > 0) {
    const urls = productImages.map((img) => img.url)
    await deleteImagesFromCloudinary(urls)
  }
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

    deleteImages(productId!)
    const isEditMode = !!productId

    if (isEditMode) {
      const currentDbImages = await db.productImage.findMany({
        where: { productId: productId as string },
        select: { url: true },
      })

      const inputUrls = images.map((img) => img.url)
      const urlsToDelete = currentDbImages
        .map((img) => img.url)
        .filter((url) => !inputUrls.includes(url))

      if (urlsToDelete.length > 0) {
        await deleteImagesFromCloudinary(urlsToDelete)
      }
    }

    await db.product.upsert({
      where: {
        id: productId || "CREATE_NEW_PRODUCT",
      },
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

export async function deleteProduct(productId: string) {
  try {
    await deleteImages(productId)

    await db.product.delete({
      where: {
        id: productId,
      },
    })

    revalidatePath("/dashboard/loja")

    return {
      success: true,
      message: "Produto e imagens deletados com sucesso!",
    }
  } catch (error) {
    console.error("Erro ao deletar produto no servidor:", error)
    return {
      success: false,
      error: "Falha ao deletar o produto no banco de dados.",
    }
  }
}
