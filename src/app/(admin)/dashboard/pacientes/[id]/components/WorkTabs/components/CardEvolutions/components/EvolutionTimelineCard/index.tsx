import { EvolutionType } from "@/data/patients.queries"

type EvolutionTimelineCardProps = {
  evolution: EvolutionType
}

const EvolutionTimelineCard = ({ evolution }: EvolutionTimelineCardProps) => {
  return (
    <>
      <h1>Cards da cada sessão</h1>
    </>
  )
}

export default EvolutionTimelineCard
