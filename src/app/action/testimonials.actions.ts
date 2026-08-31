"use server"

import { db } from "@/lib/prisma"
import {
  UpdateTestimonialInput,
  updateTestimonialSchema,
} from "@/schemas/testimonials.schema"
import { revalidatePath } from "next/cache"

export async function updateTestimonialAction(input: UpdateTestimonialInput) {
  try {
    const validation = updateTestimonialSchema.safeParse(input)

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.message,
      }
    }

    const { id, quote, recovery, isPublished } = validation.data

    const updatedTestimonial = await db.testimonial.update({
      where: { id },
      data: {
        quote,
        recovery: recovery || null,
        isPublished,
      },
    })

    revalidatePath("/dashboard/depoimentos")

    return {
      success: true,
      data: updatedTestimonial,
    }
  } catch (error) {
    console.error("Erro ao atualizar depoimento:", error)
    return {
      success: false,
      error: "Ocorreu um erro ao atualizar o depoimento. Tente novamente.",
    }
  }
}
