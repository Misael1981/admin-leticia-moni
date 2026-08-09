"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AnamnesesType,
  EvolutionType,
  PatientDetail,
  PhysicalAssessmentType,
} from "@/data/patients.queries"

import CardMedicalRecord from "./components/CardMedicalRecord"
import CardAnamnesis from "./components/CardAnamnesis"
import CardCompleteData from "./components/CardCompleteData"
import CardEvolutions from "./components/CardEvolutions"
import { PatientStatus } from "@/constants/enums"
import { VideoType } from "@/modules/videos/queries/get-videos.queries"
import {
  PatientTreatmentType,
  TreatmentForAnamnesisType,
} from "@/data/get-treatments"

type WorkTabsProps = {
  patient: PatientDetail
  anamnesis: AnamnesesType | null
  physicalAssessment: PhysicalAssessmentType | null
  evolutions: EvolutionType[] | null
  currentPatientStatus: PatientStatus
  videos: VideoType[] | null
  treatments: TreatmentForAnamnesisType[]
  patientTreatments: PatientTreatmentType[] | null
}

const WorkTabs = ({
  patient,
  anamnesis,
  physicalAssessment,
  evolutions,
  currentPatientStatus,
  videos,
  treatments,
  patientTreatments,
}: WorkTabsProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentTab = searchParams.get("tab") || "medical-record"

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className="flex w-full flex-col items-center justify-center gap-6"
    >
      <TabsList className="flex w-full max-w-full flex-nowrap gap-2 overflow-x-auto scroll-smooth px-2 py-1 md:w-fit md:justify-center md:px-0 [&::-webkit-scrollbar]:hidden">
        <TabsTrigger value="medical-record">Prontuário</TabsTrigger>
        <TabsTrigger value="evolutions">Evoluções</TabsTrigger>
        <TabsTrigger value="anamnesis">Anamnese</TabsTrigger>
        <TabsTrigger value="complete-data">Cadastro Completo</TabsTrigger>
      </TabsList>

      <TabsContent
        value="medical-record"
        className="flex w-full justify-center"
      >
        <CardMedicalRecord
          status={patient.status}
          evolutions={evolutions}
          anamnesis={anamnesis}
          patientTreatments={patientTreatments}
          physicalAssessment={physicalAssessment}
          patient={patient}
        />
      </TabsContent>

      <TabsContent value="evolutions" className="flex w-full justify-center">
        <CardEvolutions
          evolutions={evolutions}
          patientId={patient.id}
          currentPatientStatus={currentPatientStatus}
          videos={videos}
        />
      </TabsContent>

      <TabsContent value="anamnesis" className="flex w-full justify-center">
        <CardAnamnesis
          initialData={anamnesis}
          patientId={patient.id}
          physicalAssessment={physicalAssessment}
          patientTreatment={patient.treatments}
          treatments={treatments}
        />
      </TabsContent>

      <TabsContent value="complete-data" className="flex w-full justify-center">
        <CardCompleteData patient={patient} />
      </TabsContent>
    </Tabs>
  )
}

export default WorkTabs
