import {
  BiologicalSex,
  EducationLevel,
  MaritalStatus,
  PatientReferralSource,
  PatientStatus,
} from "@/constants/enums"
import { emptyToNull } from "@/helpers/empty-to-null"
import { formatDateToISO } from "@/helpers/mask-date"
import { parseOptionalCPF } from "@/helpers/parse-optional-cpf"
import { z } from "zod"

const referralValues = Object.values(PatientReferralSource) as [
  string,
  ...string[],
]

const isClient = typeof window !== "undefined"

export const patientSchema = z
  .object({
    // --- Identificação ---
    name: z
      .string()
      .min(1, "O nome do paciente é obrigatório")
      .transform((val) => val.trim()),

    nickname: emptyToNull,
    avatarUrl: z
      .union([z.string(), isClient ? z.instanceof(File) : z.any()])
      .optional()
      .nullable(),

    // --- Documentos ---
    cpf: z
      .string()
      .optional()
      .nullable()
      .transform(parseOptionalCPF)
      .refine((val) => {
        if (!val) return true
        return val.length === 11
      }, "O CPF deve conter exatamente 11 números"),

    rg: emptyToNull,

    // --- Dados pessoais & Datas ---
    birthDate: z
      .union([z.string(), z.date()])
      .optional()
      .nullable()
      .transform((value) => {
        if (!value || value === "") return null

        if (value instanceof Date) return value

        const isoDate = formatDateToISO(value)

        return isoDate ? new Date(isoDate) : null
      }),

    biologicalSex: z.enum(BiologicalSex).optional().nullable(),
    gender: emptyToNull,
    maritalStatus: z.enum(MaritalStatus).optional().nullable(),
    education: z.enum(EducationLevel).optional().nullable(),
    profession: emptyToNull,
    birthCity: emptyToNull,
    birthState: emptyToNull,
    nationality: z.string().default("Brasileiro"),

    // --- Contatos ---
    phone: z
      .string()
      .min(1, "O telefone é obrigatório para contato")
      .transform((val) => val.replace(/\D/g, "")),

    email: z
      .string()
      .email("Insira um e-mail válido")
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val)),

    emergencyContactName: emptyToNull,
    emergencyContactPhone: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? val.replace(/\D/g, "") : null)),

    // --- Endereço (Relação 1:1) ---
    address: z
      .object({
        zipCode: z
          .string()
          .optional()
          .nullable()
          .transform((val) => (val ? val.replace(/\D/g, "") : null)),
        street: emptyToNull,
        number: emptyToNull,
        complement: emptyToNull,
        district: emptyToNull,
        city: emptyToNull,
        state: emptyToNull,
      })
      .optional()
      .nullable(),

    // --- Cadastro & Situação ---
    patientSource: z
      .enum(referralValues)
      .optional()
      .nullable()
      .transform((val) => (val === "" || val === undefined ? null : val)),
    referralProfessional: emptyToNull,
    status: z.enum(PatientStatus).default("ACTIVE"),

    // --- Convênio ---
    hasInsurance: z.boolean(),
    insuranceName: emptyToNull,
    insuranceNumber: emptyToNull,
  })
  .superRefine((data, ctx) => {
    if (data.hasInsurance) {
      if (!data.insuranceName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["insuranceName"],
          message: "Informe o nome do convênio.",
        })
      }

      if (!data.insuranceNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["insuranceNumber"],
          message: "Informe o número da carteirinha.",
        })
      }
    }
  })

export type PatientFormInput = z.input<typeof patientSchema>
export type PatientFormValues = z.output<typeof patientSchema>

export const exercisePrescriptionItemSchema = z.object({
  videoId: z.string({
    message: "O vídeo é obrigatório.",
  }),
  // Nome e a thumbnail no objeto local do formulário APENAS para renderizar fácil na UI!
  videoName: z.string().optional(),
  thumbnailUrl: z.string().optional(),

  // Parâmetros da prescrição
  order: z.number().default(0),
  sets: z.coerce.number().int().min(1, "Mínimo 1 série").nullable().optional(),
  reps: z.coerce
    .number()
    .int()
    .min(1, "Mínimo 1 repetição")
    .nullable()
    .optional(),
  holdTimeSec: z.coerce.number().int().min(0).nullable().optional(),
  frequency: z.string().default("1x ao dia").optional(),
})

export const evolutionImageFormSchema = z.object({
  imageUrl: z.union([
    z.instanceof(File, { message: "Selecione um arquivo de imagem válido." }),
    z.string().url("A URL da imagem é inválida."),
    z.literal(""),
  ]),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  fileKey: z.string().optional().nullable(),
})

export const evolutionImageSchema = z.object({
  imageUrl: z.string().url("A URL da imagem é inválida."),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  fileKey: z.string().optional().nullable(),
})

export const evolutionSchema = z.object({
  sessionDate: z.date({
    message: "A data da sessão é obrigatória.",
  }),

  painScore: z.coerce
    .number()
    .int("A nota de dor deve ser um número inteiro.")
    .min(0, "A nota mínima de dor é 0.")
    .max(10, "A nota máxima de dor é 10.")
    .nullable()
    .optional(),

  notes: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]*>/g, "").trim().length > 0,
      "As anotações da evolução são obrigatórias.",
    ),

  patientStatus: z.enum(PatientStatus).default("ACTIVE"),

  exerciseVideos: z.array(exercisePrescriptionItemSchema).default([]),

  images: z.array(evolutionImageSchema).default([]),
})

// Schema usado pelo RHF (aceita File nas imagens)
export const evolutionFormSchema = evolutionSchema.extend({
  images: z.array(evolutionImageFormSchema),
})

export type EvolutionFormInput = z.input<typeof evolutionFormSchema>
export type EvolutionFormValues = z.output<typeof evolutionFormSchema>

// Tipo do payload final, pós-upload (o que realmente vai pro backend)
export type EvolutionSubmitPayload = z.output<typeof evolutionSchema>
export type ExercisePrescriptionItem = z.infer<
  typeof exercisePrescriptionItemSchema
>
export type EvolutionImage = z.infer<typeof evolutionImageSchema>

export const patientAccessSchema = z.object({
  pin: z
    .string()
    .length(6, "O PIN deve ter 6 dígitos")
    .regex(/^\d{6}$/, "O PIN deve conter apenas números"),
})

export type PatientAccessInput = z.input<typeof patientAccessSchema>
export type PatientAccessValues = z.output<typeof patientAccessSchema>
