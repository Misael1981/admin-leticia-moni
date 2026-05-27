import PageHeader from "@/components/PageHeader"
import { getTreatments } from "@/data/get-treatments"
import AddTreatmentButton from "./components/AddTreatmentButton"
import { Badge } from "@/components/ui/badge"
import CardTreatment from "./components/CardTreatment"

export default async function TreatmentsPage() {
  const treatments = await getTreatments()

  return (
    <>
      <PageHeader
        title="Gerenciamento dos tratamentos disponíveis"
        description="Gerencie os tratamentos e serviços oferecidos na clínica."
      />
      <div className="space-y-6 p-4 lg:p-8">
        <AddTreatmentButton />
        <div>
          {treatments.length === 0 && (
            <div className="p-8">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
                <h3 className="text-lg font-semibold">
                  Nenhum tratamento disponível
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Cadastre o primeiro tratamento da clínica para exibir no site.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between text-lg">
          <h2>Tratamentos disponíveis</h2>
          <Badge variant="outline">{treatments.length}</Badge>
        </div>
        <section className="flex flex-wrap justify-center gap-4">
          {treatments.map((treatment) => (
            <CardTreatment treatment={treatment} key={treatment.id} />
          ))}
        </section>
      </div>
    </>
  )
}
