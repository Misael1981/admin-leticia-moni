import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"

type SelectedCategorieNameProps = {
  categoryName: string
  groupName: string
}

const SelectedCategorieName = ({
  categoryName,
  groupName,
}: SelectedCategorieNameProps) => {
  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <div className="border-primary/50 flex items-center gap-12 border-b-2 pb-2">
        <h3 className="text-3xl font-bold">{categoryName}</h3>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <List size={16} />
          </Button>
          <Button size="sm" variant="outline">
            <Grid size={16} />
          </Button>
        </div>
      </div>

      <div className="border-primary/50 flex items-center gap-12 border-b-2 pb-2">
        {groupName === "" && (
          <h3 className="text-center text-3xl font-bold text-amber-400">
            Não há nenhum grupo selecionado
          </h3>
        )}
        <h3 className="text-3xl font-bold">{groupName}</h3>
      </div>
    </section>
  )
}

export default SelectedCategorieName
