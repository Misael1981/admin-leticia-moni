import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
  Dot,
  FileText,
  HeartPulse,
  Paperclip,
  Target,
  TrendingDown,
  Video,
} from "lucide-react"
import MetricCard from "./components/MetricCard"
import { PatientStatus } from "@/constants/enums"
import { PATIENT_STATUS_LABELS } from "@/constants/labels"
import { EvolutionType } from "@/data/patients.queries"
import { formatDate } from "@/helpers/format-date"
import { Button } from "@/components/ui/button"
import MedicalRecordCard from "./components/MedicalRecordCard"
import ListCard from "./components/ListCard"
import { MOCK_PATIENT_SUMMARY } from "@/constants/mocks"
import ActionCard from "./components/ActionCard"

type CardMedicalRecordProps = {
  status: PatientStatus
  evolutions: EvolutionType[] | null
}

const CardMedicalRecord = ({ status, evolutions }: CardMedicalRecordProps) => {
  const data = MOCK_PATIENT_SUMMARY

  const latestEvolution = evolutions?.[0]
  const firstEvolution = evolutions?.[evolutions.length - 1]

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
      <CardContent>
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
          {/* 1. KPIs / Métricas Rápidas */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Status */}
            <MetricCard
              title="Status"
              icon={
                <Activity className="h-8 w-8 text-emerald-500 opacity-80" />
              }
              content={
                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {PATIENT_STATUS_LABELS[status]}
                </span>
              }
            />

            {/* Sessões */}
            <MetricCard
              title="Sessões"
              icon={<Clock className="h-8 w-8 text-blue-500 opacity-80" />}
              content={
                <h4 className="text-primary mt-0.5 text-xl font-bold">
                  {evolutions?.length || 0}{" "}
                  <span className="text-sm font-normal text-blue-500">
                    {evolutions?.length === 1 ? "concluída" : " concluídas"}
                  </span>
                </h4>
              }
            />

            {/* Dor Atual */}
            <MetricCard
              title="Dor Atual (EVA)"
              icon={
                <HeartPulse className="h-8 w-8 text-amber-500 opacity-80" />
              }
              content={
                <div className="mt-1 flex items-baseline gap-2">
                  <h4 className="text-primary mt-0.5 text-xl font-bold">
                    {latestEvolution?.painScore ?? 0}
                    <span className="text-primary/60 text-sm font-normal">
                      / 10
                    </span>
                  </h4>

                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                    <TrendingDown className="h-3 w-3" />
                    era {firstEvolution?.painScore ?? 0}
                  </span>
                </div>
              }
            />

            {/* Última Sessão */}
            <MetricCard
              title="Última Sessão"
              icon={<Calendar className="h-8 w-8 text-indigo-500 opacity-80" />}
              content={
                <h4 className="text-primary mt-1 text-base font-bold">
                  {formatDate(latestEvolution?.createdAt) || "N/A"}
                </h4>
              }
            />
          </div>

          {/* 2. Grid Clínico: Diagnóstico, Objetivos, Plano & Alertas */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Diagnóstico & Plano */}
            <div className="space-y-6">
              <MedicalRecordCard
                title="Diagnóstico Cinesiuncional (Médico)"
                icon={<FileText className="h-4 w-4 text-blue-600" />}
                content={data.diagnostico}
              />

              <MedicalRecordCard
                title="Plano de Tratamento Ativo"
                icon={<Activity className="h-4 w-4 text-amber-600" />}
                content="Aqui será o nome do tratamento"
              />
            </div>

            {/* Objetivos & Alertas */}
            <div className="space-y-6">
              <MedicalRecordCard
                title="Queixa principal (HMA)"
                icon={<Target className="h-4 w-4 text-emerald-600" />}
                content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum odio sapien, pellentesque et fringilla efficitur, viverra id tellus. Integer vehicula posuere odio sagittis scelerisque. Mauris massa diam, lobortis id tristique ac, tempus eu tellus. Ut ultricies sed eros eget maximus. Nunc quis metus ut arcu euismod iaculis. Nulla at semper arcu, id porttitor ligula. Sed in tortor nisl. Suspendisse ipsum felis, iaculis vel interdum eu, ornare nec ligula. Donec rutrum nibh ac ante lobortis, nec aliquet enim ultricies. Donec non ipsum ac tellus feugiat mattis et in velit."
              />

              <ListCard
                title=" Alertas & Cuidados"
                icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
                list={data.alertas}
                iconItem={
                  <Dot className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                }
                className="rounded-md border border-amber-200/50 bg-amber-100/60 px-3 py-1.5 text-xs font-medium text-amber-800"
              />
            </div>
          </div>

          {/* 3. Linha do Tempo das Sessões */}
          <div className="rounded-xl border p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-indigo-600" />
              Linha do Tempo de Tratamento
            </h3>
            <div className="relative my-2 space-y-6 border-l-2 pl-6">
              {data.timelineEvents.map((evt) => (
                <div key={evt.id} className="relative">
                  <div
                    className={`absolute top-0 -left-7.75 h-4 w-4 rounded-full border-2 bg-white ${
                      evt.status === "completed"
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300"
                    }`}
                  />
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                    <span className="text-sm font-medium">{evt.title}</span>
                    <span className="font-mono text-xs text-slate-400">
                      {evt.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Última Evolução Registrar */}
          <MedicalRecordCard
            title="Última Evolução Clínica"
            icon={<FileText className="h-4 w-4 text-blue-600" />}
            content={data.ultimaEvolucao.relato}
            description={
              <span className="text-muted-foreground text-xs">
                {data.ultimaEvolucao.data} • {data.ultimaEvolucao.profissional}
              </span>
            }
          />

          {/* 5. Grid Inferior: Vídeos Prescritos & Arquivos Anexos */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Vídeos Prescritos */}
            <ActionCard
              title="Exercícios / Vídeos Prescritos"
              icon={<Video className="h-4 w-4 text-purple-600" />}
              items={data.videosPrescritos}
              renderItem={(video) => (
                <div
                  key={video.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold">{video.title}</p>

                    <p className="text-muted-foreground text-[11px]">
                      {video.duracao} • {video.frequencia}
                    </p>
                  </div>

                  <span className="px-2 py-1 text-xs font-medium text-purple-700">
                    Prescrito
                  </span>
                </div>
              )}
            />

            {/* Arquivos & Exames */}
            <ActionCard
              title="Exames & Anexos"
              icon={<Paperclip className="h-4 w-4 text-slate-600" />}
              items={data.arquivos}
              renderItem={(arquivo) => (
                <div
                  key={arquivo.id}
                  className="flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <p className="truncate text-xs font-semibold">
                      {arquivo.name}
                    </p>

                    <p className="text-muted-foreground text-[11px]">
                      {arquivo.type} • {arquivo.size}
                    </p>
                  </div>

                  <button className="shrink-0 text-xs font-medium text-blue-600 hover:underline">
                    Baixar
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button>Imprimir Pruntuário</Button>
      </CardFooter>
    </Card>
  )
}

export default CardMedicalRecord
