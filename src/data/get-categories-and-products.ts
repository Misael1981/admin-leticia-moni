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
        productsGroup: {
          orderBy: {
            position: "asc",
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
        },
      },
    })

    const sanitizedCategories = categories.map((category) => {
      const productsGroup = category.productsGroup.map((group) => ({
        ...group,
        products: group.products.map((product) => ({
          ...product,
          price: product.price.toNumber(),
        })),
      }))

      return {
        ...category,
        productsGroup,
      }
    })

    return sanitizedCategories
  } catch (error) {
    console.error("Erro ao buscar os produtos:", error)
    throw new Error("Não foi possível carregar os produtos.")
  }
}
