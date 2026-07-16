import { z } from "zod"

export const clinicSettingsSchema = z.object({
  name: z.string().min(2, "O nome da clínica deve ter pelo menos 2 caracteres"),
  whatsapp: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Digite um e-mail válido"),

  avatarImageUrl: z.any().optional(),
  coverImageUrl: z.any().optional(),
  slogan: z.string().optional().or(z.literal("")),
  socialMedia: z
    .object({
      instagram: z.string().url("URL inválida").optional().or(z.literal("")),
      facebook: z.string().url("URL inválida").optional().or(z.literal("")),
      linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
    })
    .optional(),

  street: z.string().optional().or(z.literal("")),
  number: z.string().optional().or(z.literal("")),
  complement: z.string().optional().or(z.literal("")),
  neighborhood: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z
    .string()
    .length(2, "Use a sigla do estado (ex: MG)")
    .optional()
    .or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")),
})

export type ClinicSettingsFormValues = z.infer<typeof clinicSettingsSchema>

export const contactSettingsSchema = z.object({
  name: z.string().min(2, "O nome da clínica deve ter pelo menos 2 caracteres"),
  whatsapp: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Digite um e-mail válido"),
})

export type ContactSettingsFormValues = z.infer<typeof contactSettingsSchema>

export const profileSetttingsSchema = z.object({
  avatarImageUrl: z.any().optional(),
  coverImageUrl: z.any().optional(),
  slogan: z.string().optional().or(z.literal("")),
  socialMedia: z
    .object({
      instagram: z.string().url("URL inválida").optional().or(z.literal("")),
      facebook: z.string().url("URL inválida").optional().or(z.literal("")),
      linkedin: z.string().url("URL inválida").optional().or(z.literal("")),
    })
    .optional(),
})

export type ProfileSettingsFormValues = z.infer<typeof profileSetttingsSchema>

export const addressSchema = z.object({
  street: z.string().optional().or(z.literal("")),
  number: z.string().optional().or(z.literal("")),
  complement: z.string().optional().or(z.literal("")),
  neighborhood: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z
    .string()
    .length(2, "Use a sigla do estado (ex: MG)")
    .optional()
    .or(z.literal("")),
  zipCode: z.string().optional().or(z.literal("")),
})

export type AddressFormValues = z.infer<typeof addressSchema>

export const timeSlotSchema = z
  .object({
    open: z.string().min(1, "Horário inicial obrigatório"),
    close: z.string().min(1, "Horário final obrigatório"),
  })
  .refine((data) => data.open < data.close, {
    message: "Horário inicial deve ser menor que o final",
    path: ["close"],
  })

export const businessHourSchema = z
  .object({
    dayOfWeek: z.number().min(0).max(6),
    isClosed: z.boolean(),
    timeSlots: z.array(timeSlotSchema),
  })
  .refine(
    (data) => {
      if (!data.isClosed && data.timeSlots.length === 0) {
        return false
      }
      return true
    },
    {
      message: "Adicione pelo menos um horário ou marque como fechado",
      path: ["timeSlots"],
    },
  )

export const businessHoursSchema = z.object({
  businessHours: z.array(businessHourSchema),
})

export type BusinessHoursFormData = z.infer<typeof businessHoursSchema>
