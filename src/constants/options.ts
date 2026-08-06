import {
  BiologicalSex,
  EducationLevel,
  MaritalStatus,
  PatientReferralSource,
  PatientStatus,
  PatientTreatmentStatus,
} from "./enums"
import {
  BIOLOGICAL_SEX_LABELS,
  EDUCATION_LEVEL_LABELS,
  MARITAL_STATUS_LABELS,
  PATIENT_REFERRAL_SOURCE_LABEL,
  PATIENT_STATUS_LABELS,
  PATIENT_TREATMENT_STATUS_LABELS,
} from "./labels"

export const PATIENT_STATUS_OPTIONS = [
  {
    value: PatientStatus.ACTIVE,
    label: PATIENT_STATUS_LABELS[PatientStatus.ACTIVE],
  },
  {
    value: PatientStatus.DISCHARGED,
    label: PATIENT_STATUS_LABELS[PatientStatus.DISCHARGED],
  },
  {
    value: PatientStatus.INACTIVE,
    label: PATIENT_STATUS_LABELS[PatientStatus.INACTIVE],
  },
] as const

export const BIOLOGICAL_SEX_OPTIONS = [
  {
    value: BiologicalSex.FEMALE,
    label: BIOLOGICAL_SEX_LABELS[BiologicalSex.FEMALE],
  },
  {
    value: BiologicalSex.MALE,
    label: BIOLOGICAL_SEX_LABELS[BiologicalSex.MALE],
  },
  {
    value: BiologicalSex.OTHER,
    label: BIOLOGICAL_SEX_LABELS[BiologicalSex.OTHER],
  },
] as const

export const MARITAL_STATUS_OPTIONS = [
  {
    value: MaritalStatus.DIVORCED,
    label: MARITAL_STATUS_LABELS[MaritalStatus.DIVORCED],
  },
  {
    value: MaritalStatus.MARRIED,
    label: MARITAL_STATUS_LABELS[MaritalStatus.MARRIED],
  },
  {
    value: MaritalStatus.SINGLE,
    label: MARITAL_STATUS_LABELS[MaritalStatus.SINGLE],
  },
  {
    value: MaritalStatus.STABLE_UNION,
    label: MARITAL_STATUS_LABELS[MaritalStatus.STABLE_UNION],
  },
  {
    value: MaritalStatus.WIDOWED,
    label: MARITAL_STATUS_LABELS[MaritalStatus.WIDOWED],
  },
]

export const EDUCATION_LEVEL_OPTIONS = [
  {
    value: EducationLevel.COLLEGE,
    label: EDUCATION_LEVEL_LABELS[EducationLevel.COLLEGE],
  },
  {
    value: EducationLevel.DOCTORATE,
    label: EDUCATION_LEVEL_LABELS[EducationLevel.DOCTORATE],
  },
  {
    value: EducationLevel.ELEMENTARY,
    label: EDUCATION_LEVEL_LABELS[EducationLevel.ELEMENTARY],
  },
  {
    value: EducationLevel.HIGH_SCHOOL,
    label: EDUCATION_LEVEL_LABELS[EducationLevel.HIGH_SCHOOL],
  },
  {
    value: EducationLevel.MASTER,
    label: EDUCATION_LEVEL_LABELS[EducationLevel.MASTER],
  },
  {
    value: EducationLevel.NONE,
    label: EDUCATION_LEVEL_LABELS[EducationLevel.NONE],
  },
  {
    value: EducationLevel.POSTGRADUATE,
    label: EDUCATION_LEVEL_LABELS[EducationLevel.POSTGRADUATE],
  },
  {
    value: EducationLevel.TECHNICAL,
    label: EDUCATION_LEVEL_LABELS[EducationLevel.TECHNICAL],
  },
]

export const PATIENT_REFERRAL_SOURCE_OPTION = [
  {
    value: PatientReferralSource.FACEBOOK,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.FACEBOOK],
  },
  {
    value: PatientReferralSource.FLYER,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.FLYER],
  },
  {
    value: PatientReferralSource.FRIEND_OR_FAMILY,
    label:
      PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.FRIEND_OR_FAMILY],
  },
  {
    value: PatientReferralSource.GOOGLE,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.GOOGLE],
  },
  {
    value: PatientReferralSource.HEALTH_EVENT,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.HEALTH_EVENT],
  },
  {
    value: PatientReferralSource.INSTAGRAM,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.INSTAGRAM],
  },
  {
    value: PatientReferralSource.LINKEDIN,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.LINKEDIN],
  },
  {
    value: PatientReferralSource.OTHER,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.OTHER],
  },
  {
    value: PatientReferralSource.OUTDOOR,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.OUTDOOR],
  },
  {
    value: PatientReferralSource.PATIENT_REFERRAL,
    label:
      PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.PATIENT_REFERRAL],
  },
  {
    value: PatientReferralSource.RADIO,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.RADIO],
  },
  {
    value: PatientReferralSource.STREET_ADVERTISING,
    label:
      PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.STREET_ADVERTISING],
  },
  {
    value: PatientReferralSource.TIKTOK,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.TIKTOK],
  },
  {
    value: PatientReferralSource.TV,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.TV],
  },
  {
    value: PatientReferralSource.YOUTUBE,
    label: PATIENT_REFERRAL_SOURCE_LABEL[PatientReferralSource.YOUTUBE],
  },
]

export const PATIENT_TREATMENT_STATUS_OPTIONS = [
  {
    value: PatientTreatmentStatus.ACTIVE,
    label: PATIENT_TREATMENT_STATUS_LABELS[PatientTreatmentStatus.ACTIVE],
  },
  {
    value: PatientTreatmentStatus.COMPLETED,
    label: PATIENT_TREATMENT_STATUS_LABELS[PatientTreatmentStatus.COMPLETED],
  },
  {
    value: PatientTreatmentStatus.PAUSED,
    label: PATIENT_TREATMENT_STATUS_LABELS[PatientTreatmentStatus.PAUSED],
  },
  {
    value: PatientTreatmentStatus.DISCONTINUED,
    label: PATIENT_TREATMENT_STATUS_LABELS[PatientTreatmentStatus.DISCONTINUED],
  },
]
