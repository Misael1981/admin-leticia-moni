export const PatientStatus = {
  ACTIVE: "ACTIVE",
  DISCHARGED: "DISCHARGED",
  INACTIVE: "INACTIVE",
} as const

export type PatientStatus = (typeof PatientStatus)[keyof typeof PatientStatus]

export const UserRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  USER: "USER",
  RECEPTIONIST: "RECEPTIONIST",
  PHYSIOTHERAPIST: "PHYSIOTHERAPIST",
  PATIENT: "PATIENT",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const BiologicalSex = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const

export type BiologicalSex = (typeof BiologicalSex)[keyof typeof BiologicalSex]

export const MaritalStatus = {
  SINGLE: "SINGLE",
  MARRIED: "MARRIED",
  DIVORCED: "DIVORCED",
  WIDOWED: "WIDOWED",
  STABLE_UNION: "STABLE_UNION",
} as const

export type MaritalStatus = (typeof MaritalStatus)[keyof typeof MaritalStatus]

export const EducationLevel = {
  NONE: "NONE",
  ELEMENTARY: "ELEMENTARY",
  HIGH_SCHOOL: "HIGH_SCHOOL",
  TECHNICAL: "TECHNICAL",
  COLLEGE: "COLLEGE",
  POSTGRADUATE: "POSTGRADUATE",
  MASTER: "MASTER",
  DOCTORATE: "DOCTORATE",
} as const

export type EducationLevel =
  (typeof EducationLevel)[keyof typeof EducationLevel]

export const PatientReferralSource = {
  PATIENT_REFERRAL: "PATIENT_REFERRAL",
  FRIEND_OR_FAMILY: "FRIEND_OR_FAMILY",
  GOOGLE: "GOOGLE",
  INSTAGRAM: "INSTAGRAM",
  FACEBOOK: "FACEBOOK",
  TIKTOK: "TIKTOK",
  YOUTUBE: "YOUTUBE",
  LINKEDIN: "LINKEDIN",
  HEALTH_EVENT: "HEALTH_EVENT",
  FLYER: "FLYER",
  OUTDOOR: "OUTDOOR",
  STREET_ADVERTISING: "STREET_ADVERTISING",
  RADIO: "RADIO",
  TV: "TV",
  OTHER: "OTHER",
}

export type PatientReferralSource =
  (typeof PatientReferralSource)[keyof typeof PatientReferralSource]

export const PatientTreatmentStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  PAUSED: "PAUSED",
  DISCONTINUED: "DISCONTINUED",
} as const

export type PatientTreatmentStatus =
  (typeof PatientTreatmentStatus)[keyof typeof PatientTreatmentStatus]

export const AppointmentStatus = {
  SCHEDULED: "SCHEDULED",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELED: "CANCELED",
  NO_SHOW: "NO_SHOW",
} as const

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export const BillingMode = {
  PER_SESSION: "PER_SESSION",
  ACCUMULATED: "ACCUMULATED",
} as const

export type BillingMode = (typeof BillingMode)[keyof typeof BillingMode]

export const PaymentMethod = {
  PIX: "PIX",
  CASH: "CASH",
  DEBIT_CARD: "DEBIT_CARD",
  CREDIT_CARD: "CREDIT_CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  INSURANCE: "INSURANCE",
  OTHER: "OTHER",
} as const

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod]

export const ChargeStatus = {
  OPEN: "OPEN",
  PAID: "PAID",
  CANCELED: "CANCELED",
  OVERDUE: "OVERDUE",
} as const

export type ChargeStatus = (typeof ChargeStatus)[keyof typeof ChargeStatus]
