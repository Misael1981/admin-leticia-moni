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

export const anamnesisSchema = z.object({
  mainComplaint: z.string().min(1, "A queixa principal é obrigatória."),
  medicalDiagnosis: z.string().optional(),
  accompanyingStaff: z.string().optional(),
  complementaryExams: z.string().optional(),
  hma: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]*>/g, "").trim().length > 0,
      "O Histórico da Queixa (HMA) é Obrigatório.",
    ),
  additionalSymptoms: z.string().optional(),
  preExistingConditions: z.string().optional(),
  complaintMedications: z.string().optional(),
  continuousMedications: z.string().optional(),
  physicalAssessment: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]*>/g, "").trim().length > 0,
      "A Avaliação Física é obrigatória.",
    ),
})

export type AnamnesisFormInput = z.input<typeof anamnesisSchema>
export type AnamnesisFormValues = z.output<typeof anamnesisSchema>

export const evolutionSchema = z.object({
  // Data da sessão
  sessionDate: z.date({
    message: "A data da sessão é obrigatória.",
  }),

  // Escala Visual Analógica de Dor (EVA) - Opcional, de 0 a 10
  painScore: z.coerce
    .number()
    .int("A nota de dor deve ser um número inteiro.")
    .min(0, "A nota mínima de dor é 0.")
    .max(10, "A nota máxima de dor é 10.")
    .nullable()
    .optional(),

  // Anotações da sessão (SOAP / Texto Livre)
  notes: z
    .string()
    .refine(
      (val) => val.replace(/<[^>]*>/g, "").trim().length > 0,
      "As anotações da evolução são obrigatórias.",
    ),

  patientStatus: z.enum(PatientStatus).default("ACTIVE"),
})

export type EvolutionFormInput = z.input<typeof evolutionSchema>
export type EvolutionFormValues = z.output<typeof evolutionSchema>
