"use client"

import "react-quill-new/dist/quill.snow.css"
import dynamic from "next/dynamic"

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
})

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AnamnesesType, PhysicalAssessmentType } from "@/data/patients.queries"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { PatientTreatmentStatus } from "@/constants/enums"
import { TreatmentForAnamnesisType } from "@/data/get-treatments"
import { MultiSelect } from "./components/MultiSelect"
import MultiImageUpload from "@/components/MultiImageUpload"
import { uploadMultipleImages } from "@/services/image-compresseion.service"
import { saveAnamnesisAndAssessmentAction } from "@/app/action/save-anamnesis"
import {
  AnamnesisFormInput,
  anamnesisFormSchema,
  AnamnesisFormValues,
  anamnesisSchema,
} from "@/schemas/anamnesis-schemas"

type CardAnamnesisProps = {
  patientId: string
  initialData: AnamnesesType | null
  physicalAssessment: PhysicalAssessmentType | null
  patientTreatment: ({
    treatment: {
      id: string
      name: string
      slug: string
      durationMinWeeks: number | null
      durationMaxWeeks: number | null
      sessionDurationMinutes: number | null
    }
  } & {
    id: string
    createdAt: Date
    updatedAt: Date
    patientId: string
    status: PatientTreatmentStatus
    notes: string | null
    treatmentId: string
    startDate: Date
    endDate: Date | null
  })[]
  treatments: TreatmentForAnamnesisType[]
}

const CardAnamnesis = ({
  patientId,
  initialData,
  physicalAssessment,
  patientTreatment,
  treatments,
}: CardAnamnesisProps) => {
  const [isPending, startTransition] = useTransition()

  const methods = useForm<AnamnesisFormInput, unknown, AnamnesisFormValues>({
    resolver: zodResolver(anamnesisFormSchema),
    defaultValues: {
      mainComplaint: initialData?.mainComplaint ?? "",
      medicalDiagnosis: initialData?.medicalDiagnosis ?? "",
      accompanyingStaff: initialData?.accompanyingStaff ?? "",

      complementaryExams: initialData?.complementaryExams ?? "",
      examUrls: initialData?.examUrls ?? [],
      examPublicIds: initialData?.examPublicIds ?? [],

      hma: initialData?.hma ?? "",
      additionalSymptoms: initialData?.additionalSymptoms ?? "",

      preExistingConditions: initialData?.preExistingConditions ?? "",
      complaintMedications: initialData?.complaintMedications ?? "",
      continuousMedications: initialData?.continuousMedications ?? "",
      physicalAssessment: physicalAssessment?.content ?? "",

      treatmentIds: patientTreatment.map((pt) => pt.treatment.id) ?? [],
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = methods

  const complementaryExamsValue = useWatch({
    control,
    name: "complementaryExams",
  })

  const hasExamText = Boolean(
    complementaryExamsValue && complementaryExamsValue.trim().length > 0,
  )

  const onSubmit = async (data: AnamnesisFormValues) => {
    startTransition(async () => {
      try {
        const { urls, publicIds } = await uploadMultipleImages(
          data.examUrls || [],
          data.examPublicIds || [],
        )

        const dataToSave = anamnesisSchema.parse({
          ...data,
          examUrls: urls,
          examPublicIds: publicIds,
        })

        const response = await saveAnamnesisAndAssessmentAction(
          patientId,
          dataToSave,
        )

        if (response.success) {
          toast.success("Anamnese salva com sucesso!")
        } else {
          toast.error(response.error)
        }
      } catch (error) {
        console.error("Erro no envio:", error)
        toast.error("Falha ao validar os campos do formulário.")
      }
    })
  }

  const onError = (errors: unknown) => {
    console.log("❌ O ZOD BLOQUEOU O ENVIO NESSES CAMPOS:", errors)
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Anamnese</CardTitle>
        <CardDescription>
          Registre e consulte a avaliação inicial do paciente. Nesta seção são
          armazenadas informações sobre o histórico de saúde, queixa principal,
          antecedentes, hábitos, medicamentos e demais dados essenciais para o
          planejamento e acompanhamento do tratamento fisioterapêutico.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        <FieldGroup className="space-y-6">
          <CardContent className="space-y-6">
            {/* Bloco 1 */}
            <div className="space-y-4">
              <h3 className="font-heading text-foreground text-xl">
                1. Diagnósticos e Profissionais
              </h3>

              <Field>
                <FieldLabel>Queixa principal</FieldLabel>
                <Textarea
                  className="min-h-24 resize-y"
                  placeholder="Resumo da queixa principal trazida pelo paciente..."
                  {...register("mainComplaint")}
                />
                <FieldError>{errors.mainComplaint?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Diagnóstico médico</FieldLabel>
                <Textarea
                  className="min-h-20 resize-y"
                  placeholder="Diagnóstico clínico fornecido pelo médico encaminhador..."
                  {...register("medicalDiagnosis")}
                />
                <FieldError>{errors.medicalDiagnosis?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Profissionais que acompanham</FieldLabel>
                <Input
                  placeholder="Ex: Dr. João (Ortopedista), Dra. Maria (Neurologista)"
                  {...register("accompanyingStaff")}
                />
                <FieldError>{errors.accompanyingStaff?.message}</FieldError>
              </Field>
            </div>

            {/* Bloco 2 */}
            <div className="space-y-4">
              <h3 className="font-heading text-foreground text-xl">
                2. Exames e Histórico
              </h3>

              <div className="space-y-4">
                <Field>
                  <FieldLabel>Exames Complementares</FieldLabel>
                  <Input
                    placeholder="Ex: Raio-X de coluna, Ressonância Magnética joelho D..."
                    {...register("complementaryExams")}
                  />
                  <FieldError>{errors.complementaryExams?.message}</FieldError>
                </Field>

                {/* Só renderiza o upload se tiver preenchido o texto acima ou se já existirem imagens salvas */}
                {hasExamText && (
                  <Field className="animate-in fade-in-50 duration-300">
                    <FieldLabel>Anexar Imagens/Laudos dos Exames</FieldLabel>
                    <Controller
                      name="examUrls"
                      control={control}
                      render={({ field, fieldState }) => (
                        <>
                          <MultiImageUpload
                            form={methods}
                            name="examUrls"
                            initialUrls={field.value || []}
                          />
                          {fieldState.error && (
                            <span className="mt-1 text-xs font-medium text-red-500">
                              {fieldState.error.message}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </Field>
                )}
              </div>

              <Field>
                <FieldLabel>Histórico da Queixa (HMA)</FieldLabel>
                <Controller
                  name="hma"
                  control={control}
                  render={({ field }) => (
                    <div className="overflow-hidden rounded-lg border">
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="min-h-60"
                      />
                    </div>
                  )}
                />
                <FieldError>{errors.hma?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Sintomas e demais queixas adicionais</FieldLabel>
                <Textarea
                  className="min-h-20 resize-y"
                  placeholder="Outras dores associadas, dormência, limitação funcional..."
                  {...register("additionalSymptoms")}
                />
                <FieldError>{errors.additionalSymptoms?.message}</FieldError>
              </Field>
            </div>

            {/* Bloco 3 */}
            <div className="space-y-4">
              <h3 className="font-heading text-foreground text-xl">
                3. Patologias e Medicações
              </h3>

              <Field>
                <FieldLabel>Patologias pré-existentes</FieldLabel>
                <Input
                  placeholder="Ex: Hipertensão, Diabetes, Hernia de Disco..."
                  {...register("preExistingConditions")}
                />
                <FieldError>{errors.preExistingConditions?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Medicações para queixa</FieldLabel>
                <Input
                  placeholder="Ex: Anti-inflamatórios, analgésicos pontuais..."
                  {...register("complaintMedications")}
                />
                <FieldError>{errors.complaintMedications?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Medicações contínuas</FieldLabel>
                <Input
                  placeholder="Ex: Anti-hipertensivos, protetor gástrico..."
                  {...register("continuousMedications")}
                />
                <FieldError>{errors.continuousMedications?.message}</FieldError>
              </Field>
            </div>

            {/* Bloco 4 */}
            <div className="space-y-4">
              <h3 className="font-heading text-foreground text-xl">
                4. Avaliação Física
              </h3>

              <Field>
                <FieldLabel>Avaliação Física</FieldLabel>
                <Controller
                  name="physicalAssessment"
                  control={control}
                  render={({ field }) => (
                    <div className="overflow-hidden rounded-lg border">
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="min-h-60"
                      />
                    </div>
                  )}
                />
                <FieldError>{errors.physicalAssessment?.message}</FieldError>
              </Field>
            </div>

            {/* Bloco 5 */}
            <div className="space-y-4">
              <h3 className="font-heading text-foreground text-xl">
                5. Plano Terapêutico
              </h3>

              <MultiSelect
                control={control}
                name="treatmentIds"
                options={treatments}
              />
            </div>
          </CardContent>

          <CardFooter className="">
            <div className="flex w-full justify-center">
              <Button
                className="w-full max-w-xl"
                type="submit"
                size="lg"
                disabled={isPending || !isDirty}
              >
                {isPending
                  ? "Salvando Anamnese..."
                  : initialData
                    ? "Atualizar Anamnese"
                    : "Salvar Anamnese"}
              </Button>
            </div>
          </CardFooter>
        </FieldGroup>
      </form>
    </Card>
  )
}

export default CardAnamnesis
