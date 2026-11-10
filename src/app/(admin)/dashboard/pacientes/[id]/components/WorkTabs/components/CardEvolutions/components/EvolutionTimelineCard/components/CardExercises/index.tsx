import { Dumbbell } from "lucide-react"

type CardExercisesProps = {
  prescriptions: {
    video: {
      id: string
      name: string
      description: string | null
      createdAt: string
      updatedAt: string
      url: string
      cloudinaryPublicId: string | null
      thumbnailUrl: string | null
      category: string | null
      durationSeconds: number | null
    }
    id: string
    evolutionId: string | null
    createdAt: string
    patientId: string
    updatedAt: string
    videoId: string
    order: number
    sets: number | null
    reps: number | null
    holdTimeSec: number | null
    frequency: string | null
    isActive: boolean
  }[]
}

const CardExercises = ({ prescriptions }: CardExercisesProps) => {
  return (
    <div className="bg-card space-y-4 rounded-xl border p-2 shadow-sm md:p-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-primary h-5 w-5" />
          <h3 className="font-heading text-foreground text-lg font-semibold">
            Exercícios Prescritos ({prescriptions.length})
          </h3>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-center">
          <Dumbbell className="text-muted-foreground/50 mb-2 h-10 w-10" />
          <p className="text-muted-foreground text-sm font-medium">
            Nenhum exercício prescrito nesta sessão.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-background flex flex-col gap-4 rounded-lg border p-4 shadow-xs md:flex-row md:items-center"
            >
              {/* Nome + Ordem */}
              <div className="flex items-center gap-3 md:w-1/3">
                <div className="bg-muted flex h-16 w-24 shrink-0 items-center justify-center rounded-md border">
                  <Dumbbell className="text-muted-foreground/70 size-6" />
                </div>

                <div className="space-y-1">
                  <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                    Exercício #{prescription.order}
                  </span>
                  <h4 className="line-clamp-2 text-sm leading-snug font-medium">
                    {prescription.video.name}
                  </h4>
                </div>
              </div>

              {/* Grid (Séries, Reps, Isometria, Frequência) */}
              <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <div className="text-muted-foreground mb-1 text-xs font-medium">
                    Séries
                  </div>
                  <div className="border-input bg-background flex h-10 items-center rounded-md border px-3 text-sm font-semibold">
                    {prescription.sets}x
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1 text-xs font-medium">
                    Reps
                  </div>
                  <div className="border-input bg-background flex h-10 items-center rounded-md border px-3 text-sm font-semibold">
                    {prescription.reps ?? "—"}
                    {prescription.reps ? "x" : ""}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1 text-xs font-medium">
                    Isometria (s)
                  </div>
                  <div className="border-input bg-background flex h-10 items-center rounded-md border px-3 text-sm font-semibold">
                    {prescription.holdTimeSec
                      ? `${prescription.holdTimeSec}s`
                      : "—"}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1 text-xs font-medium">
                    Frequência
                  </div>
                  <div className="border-input bg-background flex h-10 items-center rounded-md border px-3 text-sm font-semibold">
                    {prescription.frequency}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CardExercises
