import z from "zod"

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome do categoria deve ter pelo menos 2 caracteres"),
  description: z.string().optional().or(z.literal("")),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
export type CategoryFormInputValues = z.infer<typeof categorySchema>

export const productsGroupSchema = z.object({
  name: z.string().min(2, "O nome do grupo deve ter pelo menos 2 caracteres"),
  description: z.string().optional().or(z.literal("")),
})

export type ProductsGroupFormValues = z.infer<typeof productsGroupSchema>
export type ProductsGroupFormInputValues = z.infer<typeof productsGroupSchema>

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "O nome do produto deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),

  description: z
    .string()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  indications: z.string().optional().or(z.literal("")),
  benefits: z.string().optional().or(z.literal("")),

  price: z.coerce
    .number({ error: "Informe um preço válido" })
    .positive("O preço deve ser maior que zero"),

  stock: z.coerce
    .number({ error: "Informe um valor numérico" })
    .int("O estoque deve ser um número inteiro")
    .nonnegative("O estoque não pode ser negativo")
    .default(0),

  sku: z.string().optional().or(z.literal("")),

  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  images: z
    .array(
      z.object({
        id: z.string().optional(),
        url: z.string().url("Formato de imagem inválido"),
      }),
    )
    .min(1, "Envie pelo menos uma imagem para o produto"),
})

export type ProductFormInputValues = z.infer<typeof productSchema>
export type ProductFormValues = z.infer<typeof productSchema>
