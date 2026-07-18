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

const RegisterPatientForm = () => {
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

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { isSubmitting, errors },
  } = methods

  const onSubmit = async (data: PatientFormValues) => {
    console.log(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center justify-center gap-4">
          <PersonalFormCard />

          <DocumentationFormCard />

          <ContacdAndAddressForm />

          <AdministrativeInformationForm />
        </div>
      </form>
    </FormProvider>
  )
}

export default RegisterPatientForm
