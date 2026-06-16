import { db } from "@/lib/prisma"

export async function getCategoriesAndProducts() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        products: {
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
            images: {
              select: {
                id: true,
                url: true,
              },
            },
          },
        },
      },
    })

    // Tratando os dados antes de entregar para os componentes
    const sanitizedCategories = categories.map((category) => ({
      ...category,
      products: category.products.map((product) => ({
        ...product,
        // Converte o objeto Decimal do Prisma para um number puro do JS
        price: product.price.toNumber(),
      })),
    }))

    return sanitizedCategories
  } catch (error) {
    console.error("Erro ao buscar os produtos:", error)
    throw new Error("Não foi possível carregar os produtos.")
  }
}
