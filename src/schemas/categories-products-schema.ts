import z from "zod"

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome do categoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional().or(z.literal("")),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
export type CategoryFormInputValues = z.infer<typeof categorySchema>
