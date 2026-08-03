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
  CheckCircle2,
  Clock,
  FileText,
  HeartPulse,
  Paperclip,
  Target,
  TrendingDown,
  Video,
  Zap,
} from "lucide-react"
import MetricCard from "./components/MetricCard"
import { PatientStatus } from "@/constants/enums"
import { PATIENT_STATUS_LABELS } from "@/constants/labels"
import { EvolutionType } from "@/data/patients.queries"
import { formatDate } from "@/helpers/format-date"
import { Button } from "@/components/ui/button"

const MOCK_PATIENT_SUMMARY = {
  status: "Em Tratamento",
  sessoesRealizadas: 6,
  sessoesTotais: 10,
  dorAtual: 3, // escala de 0 a 10
  dorInicial: 8,
  ultimaSessao: "30/07/2026",
  diagnostico:
    "Tendinopatia do Supraespinhal à direita com limitação de ADM (Amplitude de Movimento) para abdução e rotação externa.",
  objetivos: [
    "Reduzir a dor em repouso para grau 0 em até 2 semanas",
    "Restabelecer ADM completa de abdução de ombro (180°)",
    "Fortalecimento da musculatura do manguito rotador",
  ],
  planoTerapêutico:
    "Eletroterapia analgésica (TENS) + Cinesioterapia progressiva (ganho de ADM e fortalecimento) 2x por semana.",
  alertas: [
    "Paciente relata sensibilidade aumentada no frio",
    "Histórico de hipertensão arterial controlada",
  ],
  timelineEvents: [
    {
      id: 1,
      date: "15/07/2026",
      title: "Avaliação Inicial & Anamnese",
      status: "completed",
    },
    {
      id: 2,
      date: "22/07/2026",
      title: "Ganho de ADM + Cinesioterapia Leve",
      status: "completed",
    },
    {
      id: 3,
      date: "30/07/2026",
      title: "Início de Fortalecimento com Carga Leve",
      status: "completed",
    },
    {
      id: 4,
      date: "05/08/2026",
      title: "Reavaliação de Amplitude e Dor",
      status: "upcoming",
    },
  ],
  ultimaEvolucao: {
    data: "30/07/2026",
    profissional: "Dr. Misael",
    relato:
      "Paciente relata diminuição substancial da dor matinal (EVA 3). Realizado protocolo de TENS por 20min + mobilização articular glenoumeral grau III + exercícios com theraband amarela. Boa tolerância sem dores agudas.",
  },
  videosPrescritos: [
    {
      id: 1,
      title: "Mobilização Passiva de Ombro com Bastão",
      duracao: "3 min",
      frequencia: "2x ao dia",
    },
    {
      id: 2,
      title: "Isometria de Manguito Rotador com Elástico",
      duracao: "5 min",
      frequencia: "1x ao dia",
    },
  ],
  arquivos: [
    {
      id: 1,
      name: "Ressonancia_Magnetica_Ombro_Dir.pdf",
      size: "2.4 MB",
      type: "Exame de Imagem",
    },
    {
      id: 2,
      name: "Encaminhamento_Ortopedista.pdf",
      size: "1.1 MB",
      type: "Laudo Médico",
    },
  ],
}

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
        <div className="mx-auto w-full max-w-6xl space-y-6 p-4 text-slate-800">
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
                  <span className="text-primary/60 text-sm font-normal">
                    / 10
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
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Diagnóstico Cinesiuncional
                </h3>
                <p className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
                  {data.diagnostico}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Zap className="h-4 w-4 text-amber-600" />
                  Plano Terapêutico
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {data.planoTerapêutico}
                </p>
              </div>
            </div>

            {/* Objetivos & Alertas */}
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Target className="h-4 w-4 text-emerald-600" />
                  Objetivos do Tratamento
                </h3>
                <ul className="space-y-2">
                  {data.objetivos.map((obj, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Alertas & Cuidados
                </h3>
                <ul className="space-y-2">
                  {data.alertas.map((alerta, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 rounded-md border border-amber-200/50 bg-amber-100/60 px-3 py-1.5 text-xs font-medium text-amber-800"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                      {alerta}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Linha do Tempo das Sessões */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Clock className="h-4 w-4 text-indigo-600" />
              Linha do Tempo de Tratamento
            </h3>
            <div className="relative my-2 space-y-6 border-l-2 border-slate-100 pl-6">
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
                    <span className="text-sm font-medium text-slate-800">
                      {evt.title}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {evt.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Última Evolução Registrar */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <FileText className="h-4 w-4 text-blue-600" />
                Última Evolução Clínica
              </h3>
              <span className="text-xs text-slate-400">
                {data.ultimaEvolucao.data} • {data.ultimaEvolucao.profissional}
              </span>
            </div>
            <p className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 italic">
              {data.ultimaEvolucao.relato}
            </p>
          </div>

          {/* 5. Grid Inferior: Vídeos Prescritos & Arquivos Anexos */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Vídeos Prescritos */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Video className="h-4 w-4 text-purple-600" />
                Exercícios / Vídeos Prescritos
              </h3>
              <div className="space-y-2">
                {data.videosPrescritos.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {v.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {v.duracao} • {v.frequencia}
                      </p>
                    </div>
                    <span className="rounded border border-purple-100 bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                      Prescrito
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arquivos & Exames */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Paperclip className="h-4 w-4 text-slate-600" />
                Exames & Anexos
              </h3>
              <div className="space-y-2">
                {data.arquivos.map((arq) => (
                  <div
                    key={arq.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="truncate pr-2">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {arq.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {arq.type} • {arq.size}
                      </p>
                    </div>
                    <button className="shrink-0 text-xs font-medium text-blue-600 hover:underline">
                      Baixar
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
