import z from "zod"

export const treatmentSchema = z
  .object({
    name: z
      .string()
      .min(2, "O nome do tratamento deve ter pelo menos 2 caracteres"),
    slug: z.string().min(2, "Campo obrigatório."),
    imageUrl: z.any().optional(),
    description: z.string().optional().or(z.literal("")),
    about: z.string().optional().or(z.literal("")),
    attendanceInfo: z.string().optional().or(z.literal("")),
    durationMinWeeks: z.number().optional(),
    durationMaxWeeks: z.number().optional(),
    sessionsPerWeekMin: z.number().optional(),
    sessionsPerWeekMax: z.number().optional(),
    sessionDurationMinutes: z.number().optional(),
    benefits: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.durationMinWeeks === undefined ||
        data.durationMaxWeeks === undefined
      ) {
        return true
      }
      return data.durationMinWeeks <= data.durationMaxWeeks
    },
    {
      path: ["durationMaxWeeks"],
      message: "A duração máxima deve ser maior que a mínima",
    },
  )
  .refine(
    (data) => {
      if (
        data.sessionsPerWeekMin === undefined ||
        data.sessionsPerWeekMax === undefined
      ) {
        return true
      }
      return data.sessionsPerWeekMin <= data.sessionsPerWeekMax
    },
    {
      path: ["sessionsPerWeekMax"],
      message:
        "O número de sessões por semana máxima deve ser maior que o mínimo",
    },
  )

export type TreatmentFormValues = z.infer<typeof treatmentSchema>
export type TreatmentFormInputValues = z.infer<typeof treatmentSchema>
