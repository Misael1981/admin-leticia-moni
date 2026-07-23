import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CardMedicalRecord = () => {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Prontuário</CardTitle>
        <CardDescription>
          Acompanhe a visão geral do histórico clínico do paciente em um único
          lugar. Consulte informações importantes, visualize um resumo do quadro
          clínico e acesse rapidamente a anamnese, as evoluções do tratamento e
          demais registros relacionados ao atendimento.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        You have 12 active projects and 3 pending tasks.
      </CardContent>
    </Card>
  )
}

export default CardMedicalRecord
