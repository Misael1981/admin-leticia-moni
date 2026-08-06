import z from "zod"

export const anamnesisSchema = z.object({
  mainComplaint: z.string().min(1, "A queixa principal é obrigatória."),
  medicalDiagnosis: z.string().optional(),
  accompanyingStaff: z.string().optional(),

  complementaryExams: z.string().optional(),
  examUrls: z
    .array(z.string().url("URL de exame inválida."))
    .optional()
    .default([]),
  examPublicIds: z.array(z.string()).optional().default([]),

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
  treatmentIds: z
    .array(z.string())
    .min(1, "Selecione ao menos um plano de tratamento."),
})

// Só sobrescreve o que precisa mudar pro form (examUrls aceitando File)
export const anamnesisFormSchema = anamnesisSchema.extend({
  examUrls: z
    .array(z.union([z.instanceof(File), z.string()]))
    .optional()
    .default([]),
})

export type AnamnesisFormInput = z.input<typeof anamnesisFormSchema>
export type AnamnesisFormValues = z.output<typeof anamnesisFormSchema>

export type AnamnesisData = z.output<typeof anamnesisSchema>
