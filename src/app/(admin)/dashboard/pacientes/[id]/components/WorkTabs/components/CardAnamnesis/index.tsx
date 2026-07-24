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
import {
  AnamnesisFormInput,
  AnamnesisFormValues,
  anamnesisSchema,
} from "@/schemas/patients-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { saveAnamnesisAndAssessmentAction } from "@/app/action/update-patient"
import { toast } from "sonner"

type CardAnamnesisProps = {
  patientId: string
  initialData: AnamnesesType | null
  physicalAssessment: PhysicalAssessmentType | null
}

const CardAnamnesis = ({
  patientId,
  initialData,
  physicalAssessment,
}: CardAnamnesisProps) => {
  const [isPending, startTransition] = useTransition()

  const methods = useForm<AnamnesisFormInput, unknown, AnamnesisFormValues>({
    resolver: zodResolver(anamnesisSchema),
    defaultValues: {
      mainComplaint: initialData?.mainComplaint ?? "",
      medicalDiagnosis: initialData?.medicalDiagnosis ?? "",
      accompanyingStaff: initialData?.accompanyingStaff ?? "",

      complementaryExams: initialData?.complementaryExams ?? "",
      hma: initialData?.hma ?? "",
      additionalSymptoms: initialData?.additionalSymptoms ?? "",

      preExistingConditions: initialData?.preExistingConditions ?? "",
      complaintMedications: initialData?.complaintMedications ?? "",
      continuousMedications: initialData?.continuousMedications ?? "",
      physicalAssessment: physicalAssessment?.content ?? "",
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = methods

  const onSubmit = async (data: AnamnesisFormValues) => {
    startTransition(async () => {
      try {
        const response = await saveAnamnesisAndAssessmentAction(patientId, data)
        if (response.success) {
          toast.success("Anamnese criada com sucesso!")
        } else {
          console.error(response.error)
          toast.error("Erro ao criar anamnese")
        }
      } catch (error) {
        console.error("Erro ao criar anamnese:", error)
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

              <Field>
                <FieldLabel>Exames complementares</FieldLabel>
                <Input
                  placeholder="Ex: Raio-X de coluna, Ressonância Magnética joelho D..."
                  {...register("complementaryExams")}
                />
                <FieldError>{errors.complementaryExams?.message}</FieldError>
              </Field>

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
          </CardContent>

          <CardFooter className="pt-2">
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
