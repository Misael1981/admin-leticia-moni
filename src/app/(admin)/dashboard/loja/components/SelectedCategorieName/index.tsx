import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"

type SelectedCategorieNameProps = {
  categoryName: string
}

const SelectedCategorieName = ({
  categoryName,
}: SelectedCategorieNameProps) => {
  return (
    <section className="flex items-center justify-center">
      <div className="border-primary/50 flex items-center gap-12 border-b-2 pb-2">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <List size={16} />
          </Button>
          <Button size="sm" variant="outline">
            <Grid size={16} />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default SelectedCategorieName
