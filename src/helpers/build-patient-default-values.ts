import { PatientStatus } from "@/constants/enums"
import { PatientDetailWithNumericPrice } from "@/data/patient-by-id.queries"
import { PatientFormInput } from "@/schemas/patients-schemas"

export function buildPatientDefaultValues(
  data: PatientDetailWithNumericPrice | null,
): PatientFormInput {
  return {
    name: data?.name ?? "",
    nickname: data?.nickname ?? "",
    avatarUrl: data?.avatarUrl ?? undefined,
    biologicalSex: data?.biologicalSex ?? undefined,
    gender: data?.gender ?? "",
    birthDate: data?.birthDate ? new Date(data.birthDate) : null,
    nationality: data?.nationality ?? "Brasileira",
    birthCity: data?.birthCity ?? "",
    birthState: data?.birthState ?? "",
    cpf: data?.cpf ?? "",
    rg: data?.rg ?? "",
    profession: data?.profession ?? "",
    maritalStatus: data?.maritalStatus ?? undefined,
    education: data?.education ?? undefined,
    phone: data?.phone ?? "",
    email: data?.email ?? "",
    emergencyContactName: data?.emergencyContactName ?? "",
    emergencyContactPhone: data?.emergencyContactPhone ?? "",
    address: data?.address
      ? {
          street: data.address.street ?? "",
          number: data.address.number ?? "",
          complement: data.address.complement ?? "",
          district: data.address.district ?? "",
          city: data.address.city ?? "",
          state: data.address.state ?? "",
          zipCode: data.address.zipCode ?? "",
        }
      : {
          street: "",
          number: "",
          complement: "",
          district: "",
          city: "",
          state: "",
          zipCode: "",
        },
    hasInsurance: data?.hasInsurance ?? false,
    insuranceName: data?.insuranceName ?? "",
    insuranceNumber: data?.insuranceNumber ?? "",
    patientSource: data?.patientSource ?? undefined,
    referralProfessional: data?.referralProfessional ?? "",
    status: data?.status ?? PatientStatus.ACTIVE,

    billingMode: data?.billingMode,
    billingDay: data?.billingDay?.toString() ?? "",
    defaultSessionPrice: data?.defaultSessionPrice ?? undefined,
  }
}
