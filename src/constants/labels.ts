import {
  AppointmentStatus,
  BillingMode,
  BiologicalSex,
  ChargeStatus,
  EducationLevel,
  MaritalStatus,
  PatientReferralSource,
  PatientStatus,
  PatientTreatmentStatus,
  PaymentMethod,
  UserRole,
} from "./enums"

export const PATIENT_STATUS_LABELS: Record<PatientStatus, string> = {
  ACTIVE: "Em Tratamento",
  DISCHARGED: "Alta",
  INACTIVE: "Inativo",
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrativo",
  USER: "Usuário",
  RECEPTIONIST: "Recepcionista",
  PHYSIOTHERAPIST: "Fisioterapeuta",
  PATIENT: "Paciente",
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

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  SCHEDULED: "Agendado",
  CONFIRMED: "Confirmado",
  IN_PROGRESS: "Em Andamento",
  COMPLETED: "Concluído",
  CANCELED: "Cancelado",
  NO_SHOW: "Faltou",
}

export const BILLING_MODE_LABELS: Record<BillingMode, string> = {
  PER_SESSION: "Por Sessão",
  ACCUMULATED: "Acumulado Mensal",
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: "Pix",
  CASH: "Dinheiro",
  DEBIT_CARD: "Cartão de Débito",
  CREDIT_CARD: "Cartão de Crédito",
  BANK_TRANSFER: "Tranferência Bancária",
  INSURANCE: "Seguro/Plano",
  OTHER: "Outro",
}
//ChargeStatus
export const CHARGE_STATUS_LABELS: Record<ChargeStatus, string> = {
  OPEN: "Aguardando Pagamento",
  PAID: "Paga",
  CANCELED: "Cancelada",
  OVERDUE: "Vencida",
}
