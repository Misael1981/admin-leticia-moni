import { z } from "zod"

export const createPhysiotherapistSchema = z.object({
  name: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres"),

  phone: z.string().trim().optional().nullable(),

  imageUrl: z
    .string()
    .url("URL de imagem inválida")
    .optional()
    .nullable()
    .or(z.literal("")),

  description: z.string().trim().optional().nullable().or(z.literal("")),

  crefito: z
    .string()
    .trim()
    .toUpperCase()
    .optional()
    .nullable()
    .or(z.literal("")),
})

export const physiotherapistFormSchema = createPhysiotherapistSchema.extend({
  imageUrl: z
    .union([
      z.string(),
      z.custom<File>(
        (val) => typeof window !== "undefined" && val instanceof File,
      ),
    ])
    .optional()
    .nullable(),
})

export type PhysiotherapistFormInput = z.infer<
  typeof createPhysiotherapistSchema
>
export type PhysiotherapistFormValues = z.infer<
  typeof physiotherapistFormSchema
>
