"use client"

import { Badge } from "@/components/ui/badge"
import { NotebookPen, Calendar1Icon, Dumbbell, Info } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getPainDescription } from "@/helpers/get-pain-description"
import { EvolutionType } from "@/data/patients.queries"
import CardImage from "../CardImage"

type EvolutionTimelineCardProps = {
  evolution: EvolutionType
}

const EvolutionTimelineCard = ({ evolution }: EvolutionTimelineCardProps) => {
  const formattedDatemock = format(evolution.sessionDate, "dd/MM/yyyy", {
    locale: ptBR,
  })
  const painScore = evolution.painScore ?? -1

  return (
    <div className="space-y-6 rounded-xl shadow-sm md:border md:p-4">
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <h3 className="font-heading text-foreground text-xl">
          Detalhes da Sessão
        </h3>

        <Badge variant="outline" className="gap-1 px-4 py-3">
          <NotebookPen className="size-3" />
          Sessão #{evolution.sessionNumber}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-3xs">
            <div className="text-muted-foreground mb-1.5 text-sm font-medium">
              Data da Sessão
            </div>
            <div className="border-input bg-background flex h-10 w-full items-center rounded-md border px-3 text-sm">
              <Calendar1Icon className="text-muted-foreground/60 mr-2 size-4" />
              {formattedDatemock}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-center">
            <div className="text-muted-foreground mb-2 text-sm font-medium">
              Nível de Dor (EVA)
            </div>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-md border p-1">
              {Array.from({ length: 11 }, (_, i) => {
                const isActive = i === painScore
                const isBefore = i < painScore
                return (
                  <div
                    key={i}
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-sm px-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isBefore
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground/60"
                    } `}
                  >
                    {i}
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-muted-foreground mt-2 text-center text-sm">
            {getPainDescription(evolution.painScore)}
          </p>
        </div>
      </div>

      <div className="bg-card space-y-4 rounded-xl border p-2 shadow-sm md:p-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-primary h-5 w-5" />
            <h3 className="font-heading text-foreground text-lg font-semibold">
              Exercícios Prescritos ({evolution.prescriptions.length})
            </h3>
          </div>
        </div>

        {evolution.prescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-center">
            <Dumbbell className="text-muted-foreground/50 mb-2 h-10 w-10" />
            <p className="text-muted-foreground text-sm font-medium">
              Nenhum exercício prescrito nesta sessão.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {evolution.prescriptions.map((prescription) => (
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

      {/* Bloco 3: Imagens */}
      <div>
        {evolution.images && (
          <div className="flex flex-wrap justify-center gap-4">
            {evolution.images.map((image) => (
              <CardImage key={image.id} image={image} />
            ))}
          </div>
        )}
      </div>

      {/* Bloco 4: Notas (estilo igual SessionNotes só que visualização) */}
      <div>
        <div className="text-muted-foreground mb-1.5 text-sm font-medium">
          Notas da Sessão
        </div>
        <div className="overflow-hidden rounded-lg border">
          <div className="bg-muted/30 flex items-center gap-2 border-b px-4 py-2.5">
            <Info className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-xs font-medium">
              Registro Clínico
            </span>
          </div>
          <div
            className="prose prose-sm text-foreground prose-headings:font-heading prose-p:my-2 dark:prose-invert max-w-none p-4 leading-relaxed wrap-break-word [word-break:break-word]"
            dangerouslySetInnerHTML={{ __html: evolution.notes }}
          />
        </div>
      </div>
    </div>
  )
}

export default EvolutionTimelineCard
