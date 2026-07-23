"use client"

import { PatientStatus } from "@/constants/enums"
import {
  PatientFormInput,
  PatientFormValues,
  patientSchema,
} from "@/schemas/patients-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import PersonalFormCard from "../PersonalFormCard"
import DocumentationFormCard from "../DocumentationFormCard"
import ContacdAndAddressForm from "../ContacdAndAddressForm"
import AdministrativeInformationForm from "../AdministrativeInformationForm"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { uploadToCloudinaryClient } from "@/services/image-compresseion.service"
import { createPatient } from "@/app/action/update-patient"
import { Button } from "@/components/ui/button"

const RegisterPatientForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const methods = useForm<PatientFormInput, unknown, PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      nickname: "",
      avatarUrl: "",
      biologicalSex: undefined,
      gender: "",
      birthDate: "",
      nationality: "Brasileira",
      birthCity: "",
      birthState: "",

      cpf: "",
      rg: "",
      profession: "",
      maritalStatus: undefined,
      education: undefined,

      phone: "",
      email: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      address: {
        street: "",
        number: "",
        complement: "",
        district: "",
        city: "",
        state: "",
        zipCode: "",
      },

      hasInsurance: false,
      insuranceName: "",
      insuranceNumber: "",
      patientSource: undefined,
      referralProfessional: "",
      status: PatientStatus.ACTIVE,
    },

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

        const response = await createPatient({
          ...restOfData,
          avatarUrl: finalImageUrl,
        })

        if (response.success) {
          toast.success("Paciente cadastrado com sucesso!")
          router.push("/dashboard/pacientes")
        } else {
          console.error(response.error)
          toast.error("Erro ao cadastrar paciente!")
        }
      } catch (error) {
        console.error("Erro ao cadastrar paciente:", error)
        toast.error("Ocorreu um erro ao cadastrar paciente.")
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
              {isPending ? "Salvando..." : "Cadastrar Paciente"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default RegisterPatientForm
