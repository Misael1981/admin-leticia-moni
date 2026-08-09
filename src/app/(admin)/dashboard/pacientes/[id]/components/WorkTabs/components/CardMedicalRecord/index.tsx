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
  SportShoe,
  Target,
  TrendingDown,
  Video,
} from "lucide-react"
import MetricCard from "./components/MetricCard"
import { PatientStatus } from "@/constants/enums"
import { PATIENT_STATUS_LABELS } from "@/constants/labels"
import {
  AnamnesesType,
  EvolutionType,
  PatientDetail,
  PhysicalAssessmentType,
} from "@/data/patients.queries"
import { formatDate } from "@/helpers/format-date"
import MedicalRecordCard from "./components/MedicalRecordCard"
import ListCard from "./components/ListCard"
import ActionCard from "./components/ActionCard"
import { PatientTreatmentType } from "@/data/get-treatments"
import ExamRecordCard from "./components/ExamRecordCard"
import PrintButton from "./components/PrintButton"
import { useRef } from "react"
import PrintableRecord from "./components/PrintableRecord"

type CardMedicalRecordProps = {
  status: PatientStatus
  evolutions: EvolutionType[] | null
  anamnesis: AnamnesesType | null
  patientTreatments: PatientTreatmentType[] | null
  physicalAssessment: PhysicalAssessmentType | null
  patient: PatientDetail
}

const CardMedicalRecord = ({
  status,
  evolutions,
  anamnesis,
  patientTreatments,
  physicalAssessment,
  patient,
}: CardMedicalRecordProps) => {
  const latestEvolution = evolutions?.[0]
  const firstEvolution = evolutions?.[evolutions.length - 1]

  const alertsList = [
    anamnesis?.preExistingConditions,
    anamnesis?.complaintMedications,
    anamnesis?.continuousMedications,
  ]

  const printRef = useRef<HTMLDivElement>(null)

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
        <div className="mx-auto w-full max-w-6xl space-y-6">
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
                content={anamnesis?.medicalDiagnosis || "Não informado"}
              />

              <ListCard
                title="Plano de Tratamento Ativo"
                icon={<Activity className="h-4 w-4 text-amber-600" />}
                list={patientTreatments?.map((t) => t.treatment.name) || []}
                iconItem={
                  <Dot className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                }
              />

              <MedicalRecordCard
                title="Avaliação Física"
                icon={<SportShoe className="h-4 w-4 text-emerald-500" />}
                content={physicalAssessment?.content || "Não informado"}
              />
            </div>

            {/* Objetivos & Alertas */}
            <div className="space-y-6">
              <MedicalRecordCard
                title="Queixa principal (HMA)"
                icon={<Target className="h-4 w-4 text-emerald-600" />}
                content={anamnesis?.hma || "Não informado"}
              />

              <ListCard
                title=" Alertas & Cuidados"
                icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
                list={alertsList}
                iconItem={
                  <Dot className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                }
                className="rounded-md border border-amber-200/50 bg-amber-100/60 px-3 py-1.5 text-xs font-medium text-amber-800"
              />
            </div>
          </div>

          {/* 3. Última Evolução Registrar */}
          <MedicalRecordCard
            title="Última Evolução Clínica"
            icon={<FileText className="h-4 w-4 text-blue-600" />}
            content={evolutions?.[0]?.notes || "Não há notas registradas"}
            description={
              <span className="text-muted-foreground text-xs">
                {formatDate(evolutions?.[0]?.createdAt) || "N/A"} • Dra Letícia
              </span>
            }
          />

          {/* 4. Grid Inferior: Vídeos Prescritos & Arquivos Anexos */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Vídeos Prescritos */}
            <ActionCard
              title="Exercícios / Vídeos Prescritos"
              icon={<Video className="h-4 w-4 text-purple-600" />}
              items={evolutions?.[0]?.prescriptions || []}
              renderItem={(pres) => (
                <div
                  key={pres.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold">{pres.video.name}</p>

                    <p className="text-muted-foreground text-[11px]">
                      {pres.reps} • {pres.sets} • {pres.frequency} •{" "}
                      {pres.holdTimeSec}
                    </p>
                  </div>

                  <span className="px-2 py-1 text-xs font-medium text-purple-700">
                    Prescrito
                  </span>
                </div>
              )}
            />

            {/* Arquivos & Exames */}
            <ExamRecordCard
              complementaryExams={anamnesis?.complementaryExams}
              examUrls={anamnesis?.examUrls}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <PrintButton contentRef={printRef} />

        <div className="hidden">
          <div ref={printRef}>
            <PrintableRecord
              status={patient.status}
              evolutions={evolutions}
              anamnesis={anamnesis}
              patientTreatments={patientTreatments}
              physicalAssessment={physicalAssessment}
              patient={patient}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default CardMedicalRecord
