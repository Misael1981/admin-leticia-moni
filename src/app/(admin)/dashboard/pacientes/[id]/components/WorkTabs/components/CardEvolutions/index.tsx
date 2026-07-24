import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EvolutionType } from "@/data/patients.queries"
import CardEvolutionForm from "./components/CardEvolutionForm"
import EvolutionTimelineCard from "./components/EvolutionTimelineCard"

type CardEvolutionsProps = {
  patientId: string
  evolutions: EvolutionType[] | null
}

const CardEvolutions = ({ patientId, evolutions }: CardEvolutionsProps) => {
  const lastSessionNumber = evolutions?.[0]?.sessionNumber ?? 0

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
      <CardContent className="space-y-6">
        <CardEvolutionForm
          patientId={patientId}
          lastSessionNumber={lastSessionNumber}
        />

        {evolutions && (
          <div className="space-y-4">
            {evolutions.map((item) => (
              <EvolutionTimelineCard key={item.id} evolution={item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CardEvolutions
