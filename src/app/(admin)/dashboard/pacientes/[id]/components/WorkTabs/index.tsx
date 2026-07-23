"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnamnesesType, PatientDetail } from "@/data/patients.queries"

import CardMedicalRecord from "./components/CardMedicalRecord"
import CardDevelopments from "./components/CardDevelopments"
import CardAnamnesis from "./components/CardAnamnesis"
import CardCompleteData from "./components/CardCompleteData"

type WorkTabsProps = {
  patient: PatientDetail
  anamnesis: AnamnesesType | null
}

const WorkTabs = ({ patient, anamnesis }: WorkTabsProps) => {
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
        <CardMedicalRecord />
      </TabsContent>

      <TabsContent value="evolutions" className="flex w-full justify-center">
        <CardDevelopments />
      </TabsContent>

      <TabsContent value="anamnesis" className="flex w-full justify-center">
        <CardAnamnesis initialData={anamnesis} />
      </TabsContent>

      <TabsContent value="complete-data" className="flex w-full justify-center">
        <CardCompleteData patient={patient} />
      </TabsContent>
    </Tabs>
  )
}

export default WorkTabs
