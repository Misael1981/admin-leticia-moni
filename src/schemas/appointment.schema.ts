import { AppointmentStatus } from "@/constants/enums"
import { z } from "zod"

export const createAppointmentSchema = z
  .object({
    clinicId: z.string().min(1, "Clínica é obrigatória"),
    patientId: z.string().min(1, "Selecione um paciente"),
    physiotherapistId: z.string().min(1, "Selecione o fisioterapeuta"),
    treatmentId: z.string().min(1, "Selecione o tratamento"),

    startTime: z.coerce.date({
      message: "Horário de início é obrigatório",
    }),
    endTime: z.coerce.date({
      message: "Horário de término é obrigatório",
    }),

    status: z.nativeEnum(AppointmentStatus).default("SCHEDULED"),

    sessionNumber: z.coerce
      .number()
      .int()
      .positive("O número da sessão deve ser maior que zero")
      .optional()
      .nullable(),

    notes: z
      .string()
      .max(1000, "Observações podem ter no máximo 1000 caracteres")
      .optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "O horário de término deve ser posterior ao horário de início",
    path: ["endTime"],
  })

export type CreateAppointmentInput = z.input<typeof createAppointmentSchema>
export type CreateAppointmentValues = z.output<typeof createAppointmentSchema>
