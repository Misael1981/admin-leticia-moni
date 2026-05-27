import z from "zod"

export const treatmentSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do tratamento deve ter pelo menos 2 caracteres"),
  description: z.string().optional().or(z.literal("")),
  imageUrl: z.any().optional(),
})
