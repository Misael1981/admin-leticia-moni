import { db } from "@/lib/prisma"
import { Prisma } from "@misael1981/physio-database"

interface GetTestimonialsProps {
  whereClause?: Prisma.TestimonialWhereInput
  currentPage: number
  ITEMS_PER_PAGE: number
}

export async function getAllTestimonials({
  whereClause,
  currentPage,
  ITEMS_PER_PAGE,
}: GetTestimonialsProps) {
  try {
    const testimonials = await db.testimonial.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" }, // Moderação costuma ver os mais recentes primeiro
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      select: {
        id: true,
        name: true,
        thumbnail: true,
        recovery: true,
        quote: true,
        description: true,
        rating: true,
        isPublished: true,
        displayOrder: true,
        createdAt: true,
        treatment: {
          select: {
            name: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            nickname: true,
          },
        },
      },
    })

    return testimonials
  } catch (error) {
    console.error("Erro ao buscar depoimentos:", error)
    throw new Error("Não foi possível carregar depoimentos dos usuários.")
  }
}

interface GetCountTestimonialsProps {
  whereClause?: Prisma.TestimonialWhereInput
}

export async function getCountTestimonials({
  whereClause,
}: GetCountTestimonialsProps) {
  try {
    // Adicionado o await no db.testimonial.count
    const totalTestimonials = await db.testimonial.count({
      where: whereClause,
    })

    return totalTestimonials
  } catch (error) {
    console.error("Erro ao buscar total de depoimentos:", error)
    throw new Error(
      "Não foi possível carregar total de depoimentos dos usuários.",
    )
  }
}

export async function getCountTestimonialsByStatus() {
  try {
    const [publishedCount, unpublishedCount] = await Promise.all([
      db.testimonial.count({
        where: {
          isPublished: true,
        },
      }),
      db.testimonial.count({
        where: {
          isPublished: false,
        },
      }),
    ])

    return {
      publishedCount,
      unpublishedCount,
    }
  } catch (error) {
    console.error("Erro ao buscar contagem de depoimentos por status:", error)
    throw new Error(
      "Não foi possível carregar a contagem de depoimentos por status.",
    )
  }
}
