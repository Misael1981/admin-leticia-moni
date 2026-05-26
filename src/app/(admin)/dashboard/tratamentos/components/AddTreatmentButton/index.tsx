import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import Link from "next/link"

const AddTreatmentButton = () => {
  return (
    <section className="flex w-full justify-end">
      <Link href="/dashboard/tratamentos/novo">
        <Button>
          <CirclePlus />
          Adicionar Novo Tratamento
        </Button>
      </Link>
    </section>
  )
}

export default AddTreatmentButton
