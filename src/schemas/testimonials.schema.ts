import { z } from "zod"

export const updateTestimonialSchema = z.object({
  id: z.string().uuid({ message: "ID do depoimento inválido." }),
  quote: z
    .string()
    .min(1, { message: "O destaque (quote) não pode ficar vazio." }),
  recovery: z.string().optional().nullable(),
  isPublished: z.boolean(),
})

export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>
