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
import { PatientStatus } from "@/constants/enums"
import { VideoType } from "@/modules/videos/queries/get-videos.queries"
import { evolutionMock } from "@/constants/mocks"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type CardEvolutionsProps = {
  patientId: string
  evolutions: EvolutionType[] | null
  currentPatientStatus: PatientStatus
  videos: VideoType[] | null
}

const CardEvolutions = ({
  patientId,
  evolutions,
  currentPatientStatus,
  videos,
}: CardEvolutionsProps) => {
  const lastSessionNumber = evolutions?.[0]?.sessionNumber ?? 0

  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
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
            currentPatientStatus={currentPatientStatus}
            videos={videos}
          />
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Histórico de Sessões</CardTitle>
          <CardDescription>
            Histórico de sessões do paciente, incluindo informações sobre as
            consultas realizadas, a conduta adotada, a resposta ao tratamento, a
            evolução do quadro clínico e observações relevantes de cada
            atendimento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="space-y-4">
            {evolutionMock.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="rounded-xl border px-6"
              >
                <AccordionTrigger className="hover:no-underline">
                  Sessão {item.sessionNumber}
                </AccordionTrigger>

                <AccordionContent>
                  <EvolutionTimelineCard evolution={item} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* {evolutions && (
            <div className="space-y-4">
              {evolutions.map((item) => (
                <EvolutionTimelineCard key={item.id} evolution={item} />
              ))}
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  )
}

export default CardEvolutions
