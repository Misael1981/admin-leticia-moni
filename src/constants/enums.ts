export const PatientStatus = {
  ACTIVE: "ACTIVE",
  DISCHARGED: "DISCHARGED",
  INACTIVE: "INACTIVE",
} as const

export type PatientStatus = (typeof PatientStatus)[keyof typeof PatientStatus]

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
