import PageHeader from "@/components/PageHeader"
import PhysiotherapistForm from "./components/PhysiotherapistForm"
import { getPhysiotherapists } from "@/data/physiotherapist.queries"
import EmptyData from "@/components/EmptyData"
import { Users } from "lucide-react"
import PhysiotherapistCard from "./components/PhysiotherapistCard"

export default async function ProfessionalsPage() {
  const physiotherapists = await getPhysiotherapists()

  return (
    <div className="space-y-6">
      <PageHeader title="Gerencie os dados dos Profissionais" />

      <div className="flex flex-col items-center gap-6">
        <section className="w-full">
          {physiotherapists.length === 0 ? (
            <EmptyData
              icon={Users}
              title="Nenhum Fisioterapeuta Encontrado"
              description="Cadastre o primeiro Fisioterapeuta."
            />
          ) : (
            <ul className="flex w-full flex-col items-center justify-center gap-4 divide-y">
              {physiotherapists.map((physiotherapist) => (
                <li
                  key={physiotherapist.id}
                  className="w-full max-w-4xl pt-4 first:pt-0"
                >
                  <PhysiotherapistCard physiotherapist={physiotherapist} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <PhysiotherapistForm />
      </div>
    </div>
  )
}
