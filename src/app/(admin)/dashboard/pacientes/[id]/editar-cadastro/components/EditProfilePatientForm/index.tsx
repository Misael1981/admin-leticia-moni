"use client"

import { updatePatient } from "@/app/action/update-patient"
import { PatientStatus } from "@/constants/enums"
import { PatientDetail } from "@/data/patients.queries"
import {
  PatientFormInput,
  PatientFormValues,
  patientSchema,
} from "@/schemas/patients-schemas"
import { uploadToCloudinaryClient } from "@/services/image-compresseion.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import PersonalFormCard from "../../../../cadastrar-paciente/components/PersonalFormCard"
import DocumentationFormCard from "../../../../cadastrar-paciente/components/DocumentationFormCard"
import ContacdAndAddressForm from "../../../../cadastrar-paciente/components/ContacdAndAddressForm"
import AdministrativeInformationForm from "../../../../cadastrar-paciente/components/AdministrativeInformationForm"
import { Button } from "@/components/ui/button"

type EditProfilePatientFormProps = {
  initialData: PatientDetail | null
  patientId: string
}

const EditProfilePatientForm = ({
  initialData,
  patientId,
}: EditProfilePatientFormProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = Boolean(initialData?.id)

  const buildDefaultValues = (
    data: PatientDetail | null,
  ): PatientFormInput => ({
    name: data?.name ?? "",
    nickname: data?.nickname ?? "",
    avatarUrl: data?.avatarUrl ?? "",
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
  })

  const methods = useForm<PatientFormInput, unknown, PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: buildDefaultValues(initialData),
    mode: "onChange",
  })

  const { handleSubmit } = methods

  const onSubmit = async (data: PatientFormValues) => {
    startTransition(async () => {
      try {
        let finalImageUrl = ""
        const avatarValue = data.avatarUrl as unknown

        if (avatarValue instanceof File) {
          const uploadResult = await uploadToCloudinaryClient(avatarValue)
          finalImageUrl = uploadResult.url
        } else if (typeof data.avatarUrl === "string") {
          finalImageUrl = data.avatarUrl
        }

        const { avatarUrl: _avatarUrl, ...restOfData } = data

        // 🔄 Chame a Action baseada no modo (Edição vs Criação)
        const response = await updatePatient(patientId, {
          ...restOfData,
          avatarUrl: finalImageUrl,
        })

        if (response.success) {
          toast.success(
            isEditing ? "Paciente atualizado!" : "Paciente cadastrado!",
          )
          router.push(`/dashboard/pacientes/${patientId}`)
        } else {
          toast.error(response.error || "Erro ao salvar paciente!")
        }
      } catch (error) {
        console.error("Erro ao salvar paciente:", error)
        toast.error("Ocorreu um erro ao processar o formulário.")
      }
    })
  }

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="flex flex-col items-center justify-center gap-6">
          <PersonalFormCard />

          <DocumentationFormCard />

          <ContacdAndAddressForm />

          <AdministrativeInformationForm />

          <div className="flex w-full justify-center">
            <Button
              className="w-full max-w-xl"
              type="submit"
              size="lg"
              disabled={isPending}
            >
              {isPending ? "Salvando..." : "Editar Cadastro do Paciente"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default EditProfilePatientForm
