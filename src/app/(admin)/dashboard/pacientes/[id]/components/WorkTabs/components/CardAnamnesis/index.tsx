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
import { AnamnesesType } from "@/data/patients.queries"
import {
  AnamnesisFormInput,
  AnamnesisFormValues,
  anamnesisSchema,
} from "@/schemas/patients-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"

type CardAnamnesisProps = {
  patientId: string // Importante passar o ID do paciente para a Server Action de upsert!
  initialData: AnamnesesType | null
}

const CardAnamnesis = ({ patientId, initialData }: CardAnamnesisProps) => {
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
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = methods

  const onSubmit = async (data: AnamnesisFormValues) => {
    startTransition(async () => {
      console.log("Dados prontos para o upsert:", { patientId, ...data })
      // Aqui entra a chamada da Server Action:
      // const res = await saveAnamnesisAction({ patientId, ...data })
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
        <CardContent>
          <FieldGroup className="space-y-6">
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
                <FieldLabel>História da Moléstia Atual (HMA)</FieldLabel>
                <Textarea
                  className="min-h-36 resize-y"
                  placeholder="Descreva detalhadamente o início dos sintomas, evolução, fatores de melhora/piora..."
                  {...register("hma")}
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
          </FieldGroup>
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
      </form>
    </Card>
  )
}

export default CardAnamnesis
