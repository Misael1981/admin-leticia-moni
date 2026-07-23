import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CardMedicalRecord = () => {
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Prontuário</CardTitle>
        <CardDescription>
          View your key metrics and recent project activity. Track progress
          across all your active projects.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        You have 12 active projects and 3 pending tasks.
      </CardContent>
    </Card>
  )
}

export default CardMedicalRecord
