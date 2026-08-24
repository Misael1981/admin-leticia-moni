import { z } from "zod"
import { UserRole } from "@/constants/enums" // Ou de onde você importa o enum UserRole

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome pode ter no máximo 100 caracteres"),

  email: z
    .string()
    .trim()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido"),

  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true
        const digitsOnly = val.replace(/\D/g, "")
        return digitsOnly.length >= 10 && digitsOnly.length <= 11
      },
      { message: "Telefone deve ter 10 ou 11 dígitos (com DDD)" },
    ),

  image: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true
        try {
          new URL(val)
          return true
        } catch {
          return false
        }
      },
      { message: "A foto deve ser uma URL válida" },
    ),

  role: z.enum(UserRole, {
    error: "Selecione um perfil de acesso válido",
  }),
})

// Tipo inferido automaticamente para usar no React Hook Form
export type CreateUserInput = z.input<typeof createUserSchema>
export type CreateUserValues = z.output<typeof createUserSchema>
