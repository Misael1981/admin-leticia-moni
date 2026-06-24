import { db } from "@/lib/prisma"

export async function getProductById({ id }: { id: string }) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        indications: true,
        benefits: true,
        price: true,
        stock: true,
        sku: true,
        isActive: true,
        isFeatured: true,
        groupId: true,
        categoryId: true,
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    })

    if (!product) {
      return null
    }

    const sanitizedProduct = {
      ...product,
      price: product.price.toNumber(),
    }

    return sanitizedProduct
  } catch (error) {
    console.error("Erro ao buscar o produto:", error)
    throw new Error("Não foi possível carregar o produto.")
  }
}
