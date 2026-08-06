import {
  BiologicalSex,
  EducationLevel,
  MaritalStatus,
  PatientReferralSource,
  PatientStatus,
  PatientTreatmentStatus,
} from "./enums"

export const PATIENT_STATUS_LABELS: Record<PatientStatus, string> = {
  ACTIVE: "Em Tratamento",
  DISCHARGED: "Alta",
  INACTIVE: "Inativo",
}

export const BIOLOGICAL_SEX_LABELS: Record<BiologicalSex, string> = {
  MALE: "Masculino",
  FEMALE: "Feminino",
  OTHER: "Outro",
}

export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  SINGLE: "Solteiro(a)",
  MARRIED: "Casado",
  DIVORCED: "Divorciado(a)",
  WIDOWED: "Viúvo(a)",
  STABLE_UNION: "União Estável",
}

export const EDUCATION_LEVEL_LABELS: Record<EducationLevel, string> = {
  NONE: "Nenhum",
  ELEMENTARY: "Ensino Fundamental",
  HIGH_SCHOOL: "Ensino Médio",
  TECHNICAL: "Tecnólogo",
  COLLEGE: "Ensino Superior",
  POSTGRADUATE: "Pós Graduado",
  MASTER: "Mestrado",
  DOCTORATE: "Doutorado",
}

export const PATIENT_REFERRAL_SOURCE_LABEL: Record<
  PatientReferralSource,
  string
> = {
  PATIENT_REFERRAL: "Indicação de paciente",
  FRIEND_OR_FAMILY: "Amigos ou familiares",
  GOOGLE: "Pesquisa no Google",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  LINKEDIN: "LinkedIn",
  HEALTH_EVENT: "Evento de saúde",
  FLYER: "Panfleto",
  OUTDOOR: "Outdoor",
  STREET_ADVERTISING: "STREET_ADVERTISING",
  RADIO: "Publicidade em rua",
  TV: "Publicidade na TV",
  OTHER: "Outros",
}

export const PATIENT_TREATMENT_STATUS_LABELS: Record<
  PatientTreatmentStatus,
  string
> = {
  ACTIVE: "Ativo",
  COMPLETED: "Concluído",
  PAUSED: "Pausado",
  DISCONTINUED: "Descontinuado",
}
