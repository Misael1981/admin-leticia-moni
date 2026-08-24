import { z } from "zod"
import { UserRole } from "@/constants/enums"

export const createUserSchema = z.object({
  name: z.string().trim().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z
    .string()
    .trim()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  phone: z.string().trim().optional().nullable(),
  image: z.string().optional().nullable(),
  role: z.enum(UserRole, {
    error: "Selecione um perfil de acesso válido",
  }),
})

export const userFormSchema = createUserSchema.extend({
  image: z
    .union([
      z.string(),
      z.custom<File>(
        (val) => typeof window !== "undefined" && val instanceof File,
      ),
    ])
    .optional()
    .nullable(),
})

// Tipos isolados
export type CreateUserInput = z.infer<typeof createUserSchema> // Usado na Action / Prisma
export type UserFormValues = z.infer<typeof userFormSchema> // Usado no useForm
