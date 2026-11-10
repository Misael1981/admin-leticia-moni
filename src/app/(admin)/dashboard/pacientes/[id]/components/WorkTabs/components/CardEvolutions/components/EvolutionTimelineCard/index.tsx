"use client"

import { NotebookPen, Calendar1Icon, Info, ActivityIcon } from "lucide-react"
import { EvolutionType } from "@/data/evolutions.queries"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/helpers/format-date"
import CardImage from "./components/CardImage"
import NotesPostSessions from "./components/NotesPostSesions"
import CardExercises from "./components/CardExercises"

type EvolutionTimelineCardProps = {
  evolution: EvolutionType
}

const EvolutionTimelineCard = ({ evolution }: EvolutionTimelineCardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <h3 className="font-heading text-foreground text-xl">
          Detalhes da Sessão
        </h3>

        <Badge variant="outline" className="gap-1 px-4 py-3">
          <NotebookPen className="size-3" />
          Sessão #{evolution.sessionNumber}
        </Badge>
      </div>

      {/* Bloco 1: data e EVA */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-muted/30 rounded-lg border p-4">
          <span className="text-muted-foreground mb-2 block text-sm font-medium">
            Data da Sessão
          </span>

          <div className="flex items-center gap-2">
            <Calendar1Icon className="text-muted-foreground size-4 shrink-0" />
            <span className="text-sm font-semibold">
              {formatDate(evolution.sessionDate)}
            </span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg border p-4">
          <span className="text-muted-foreground mb-2 block text-sm font-medium">
            Nível de Dor (EVA)
          </span>

          <div className="flex items-center gap-2">
            <ActivityIcon className="text-muted-foreground size-4 shrink-0" />
            <span className="text-lg font-semibold tabular-nums">
              {evolution.painScore}
              <span className="text-muted-foreground ml-1 text-sm font-normal">
                / 10
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Bloco 2: Exercícios Prescritos */}
      <CardExercises prescriptions={evolution.prescriptions} />

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

      <NotesPostSessions
        sessionId={evolution.id}
        initialNotes={evolution.notesPostSesions}
        patientId={evolution.patientId}
      />
    </div>
  )
}

export default EvolutionTimelineCard
