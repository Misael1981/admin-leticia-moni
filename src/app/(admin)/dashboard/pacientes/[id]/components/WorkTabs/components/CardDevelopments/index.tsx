import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CardDevelopments = () => {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Evoluções</CardTitle>
        <CardDescription>
          Registre a evolução clínica do paciente ao longo do tratamento. Cada
          evolução representa uma consulta realizada, permitindo documentar a
          conduta adotada, a resposta ao tratamento, a evolução do quadro
          clínico e observações relevantes de cada atendimento.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        You have 12 active projects and 3 pending tasks.
      </CardContent>
    </Card>
  )
}

export default CardDevelopments
