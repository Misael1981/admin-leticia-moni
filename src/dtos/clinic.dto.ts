import { JsonValue } from "@misael1981/physio-database/generated-client/runtime/library"

export interface SocialMediaJson {
  instagram?: string
  facebook?: string
  linkedin?: string
}

export interface TimeSlotDTO {
  type: "BREAKFAST" | "LUNCH" | "DINNER" | "SPECIAL"
  open: string
  close: string
}

export interface BusinessHoursDTO {
  id: string
  createdAt: Date
  updatedAt: Date
  clinicId: string
  dayOfWeek: number
  timeSlots: JsonValue
  isClosed: boolean
  displayOrder: number
}

export interface ClinicDTO {
  id?: string | null
  name: string | null
  whatsapp: string | null
  phone: string | null
  email: string | null

  avatarImageUrl: string | null
  coverImageUrl: string | null
  slogan: string | null
  socialMedia: JsonValue | null

  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  zipCode: string | null

  businessHours: BusinessHoursDTO[]
}

// Forçando o TypeScript a tratar o JsonValue como o seu array de TimeSlot
//const slots = (businessHour.timeSlots as unknown) as TimeSlot[]

// Agora você pode usar com autocompletar perfeito e sem erros!
// slots.map((slot) => {
//   console.log(slot.startTime)
// })
