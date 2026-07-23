import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AnamnesesType } from "@/data/patients.queries"
import {
  AnamnesisFormInput,
  AnamnesisFormValues,
  anamnesisSchema,
} from "@/schemas/patients-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

type CardAnamnesisProps = {
  initialData: AnamnesesType | null
}

const CardAnamnesis = ({ initialData }: CardAnamnesisProps) => {
  const form = useForm<AnamnesisFormInput, unknown, AnamnesisFormValues>({
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
      <CardContent className="text-muted-foreground text-sm">
        You have 12 active projects and 3 pending tasks.
      </CardContent>
    </Card>
  )
}

export default CardAnamnesis
