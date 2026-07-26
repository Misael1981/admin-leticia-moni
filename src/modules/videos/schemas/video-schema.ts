import { z } from "zod"

const isClient = typeof window !== "undefined"

export const videoSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do exercício deve ter pelo menos 3 caracteres.")
    .max(100, "O nome é muito longo."),

  description: z.string().optional().nullable(),

  category: z
    .string()
    .min(2, "Selecione ou digite uma categoria válida.")
    .optional()
    .nullable(),

  url: z.union([
    z.string().url("URL de vídeo inválida."),
    isClient ? z.instanceof(File) : z.any(),
  ]),

  thumbnailUrl: z
    .union([z.string(), isClient ? z.instanceof(File) : z.any()])
    .optional()
    .nullable(),
  // Mídias e metadados que o upload preenche automaticamente em background
  cloudinaryPublicId: z.string().optional().nullable(),
  durationSeconds: z.number().optional().nullable(),
})

// Tipo inferido para ser usado no React Hook Form / Actions
export type VideoFormInput = z.input<typeof videoSchema>
export type VideoFormValues = z.output<typeof videoSchema>
