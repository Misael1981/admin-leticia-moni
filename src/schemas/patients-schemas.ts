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

export const patientSchema = z
  .object({
    // --- Identificação ---
    name: z
      .string()
      .min(1, "O nome do paciente é obrigatório")
      .transform((val) => val.trim()),

    nickname: emptyToNull,
    avatarUrl: emptyToNull,

    // --- Documentos ---
    cpf: z
      .string()
      .optional()
      .nullable()
      .transform(parseOptionalCPF)
      .refine((val) => {
        if (!val) return true // Se for vazio/null, passa direto
        return val.length === 11 // Valida se tem os 11 dígitos numéricos
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
      .transform((val) => val.replace(/\D/g, "")), // Deixa apenas os números para salvar limpo no banco

    email: z
      .string()
      .email("Insira um e-mail válido")
      .or(z.literal("")) // Aceita e-mail vazio de forma segura
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
        district: emptyToNull, // Mapeado para o seu campo "district" do Address
        city: emptyToNull,
        state: emptyToNull,
      })
      .optional()
      .nullable(),

    // --- Cadastro & Situação ---
    patientSource: z.enum(PatientReferralSource).optional().nullable(),
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

// Use o tipo de entrada para o formulário (antes das transforms) e o tipo de saída para os valores validados.
export type PatientFormInput = z.input<typeof patientSchema>
export type PatientFormValues = z.output<typeof patientSchema>
