"use client"

import { updatePatient } from "@/app/action/update-patient"
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
import { Button } from "@/components/ui/button"
import { PatientDetailWithNumericPrice } from "@/data/patient-by-id.queries"
import PersonalFormCard from "@/components/PersonalFormCard"
import DocumentationFormCard from "@/components/DocumentationFormCard"
import ContacdAndAddressForm from "@/components/ContacdAndAddressForm"
import AdministrativeInformationForm from "@/components/AdministrativeInformationForm"
import FinancialForm from "@/components/FinancialForm"
import { buildPatientDefaultValues } from "@/helpers/build-patient-default-values"

type EditProfilePatientFormProps = {
  initialData: PatientDetailWithNumericPrice | null
  patientId: string
}

const EditProfilePatientForm = ({
  initialData,
  patientId,
}: EditProfilePatientFormProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = Boolean(initialData?.id)

  const methods = useForm<PatientFormInput, unknown, PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: buildPatientDefaultValues(initialData),
    mode: "onChange",
  })

  const { handleSubmit } = methods

  const onSubmit = async (data: PatientFormValues) => {
    startTransition(async () => {
      try {
        let finalImageUrl: string | undefined
        const avatarValue = data.avatarUrl as unknown

        if (avatarValue instanceof File) {
          const uploadResult = await uploadToCloudinaryClient(avatarValue)
          finalImageUrl = uploadResult.url
        } else if (typeof data.avatarUrl === "string") {
          finalImageUrl = data.avatarUrl
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { avatarUrl: _avatarUrl, ...restOfData } = data

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
          console.error("❌ Resposta da action:", response)
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

          <FinancialForm />

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
