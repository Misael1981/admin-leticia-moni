import { JsonValue } from "@misael1981/physio-database/generated-client/runtime/library"

export interface SocialMediaJson {
  instagram?: string
  facebook?: string
  linkedin?: string
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
}
