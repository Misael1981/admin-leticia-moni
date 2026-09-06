"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { EvolutionFormValues } from "@/schemas/patients-schemas"
import { VideoType } from "@/modules/videos/queries/get-videos.queries"
import { PlusCircle, Trash2, Dumbbell } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import DialogWorkoutList from "../DialogWorkoutList"

type SessionWorkoutSelectorProps = {
  videos: VideoType[] | null
}

const SessionWorkoutSelector = ({ videos }: SessionWorkoutSelectorProps) => {
  const [isOpenDialogWorkoutList, setOpenDialogWorkoutList] = useState(false)

  const {
    control,
    formState: { errors },
  } = useFormContext<EvolutionFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exerciseVideos",
  })

  const handleConfirmSelection = (selectedVideoIds: string[]) => {
    const existingVideoIds = fields.map((field) => field.videoId)

    selectedVideoIds.forEach((id) => {
      if (!existingVideoIds.includes(id)) {
        const videoData = videos?.find((v) => v.id === id)

        append({
          videoId: id,
          videoName: videoData?.name || "Exercício sem nome",
          thumbnailUrl: videoData?.thumbnailUrl || "/logo.svg",
          order: 0,
          sets: 3,
          reps: 10,
          holdTimeSec: 0,
          frequency: "1x ao dia",
        })
      }
    })

    fields.forEach((field, index) => {
      if (!selectedVideoIds.includes(field.videoId)) {
        remove(index)
      }
    })

    setOpenDialogWorkoutList(false)
  }

  return (
    <div className="bg-card space-y-4 rounded-xl border p-4 shadow-sm">
      {/* Cabeçalho do Bloco */}
      <div className="flex flex-col items-center justify-center gap-2 border-b pb-3 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-primary h-5 w-5" />
          <h3 className="font-heading text-foreground text-lg font-semibold">
            Exercícios da Sessão ({fields.length})
          </h3>
        </div>

        <Button
          type="button"
          onClick={() => setOpenDialogWorkoutList(true)}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          {fields.length > 0 ? "Gerenciar Exercícios" : "Adicionar Exercício"}
        </Button>
      </div>

      {/* Se não tiver exercícios selecionados */}
      {fields.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-center">
          <Dumbbell className="text-muted-foreground/50 mb-2 h-10 w-10" />
          <p className="text-muted-foreground text-sm font-medium">
            Nenhum exercício selecionado para esta sessão.
          </p>
          <p className="text-muted-foreground/80 text-xs">
            Clique no botão acima para escolher da biblioteca da Letícia.
          </p>
        </div>
      )}

      {/* 📋 LISTA DOS VÍDEOS COM OS INPUTS DA PRESCRIÇÃO */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="bg-background hover:border-primary/50 flex flex-col gap-4 rounded-lg border p-4 shadow-xs transition-all md:flex-row md:items-center"
          >
            {/* Thumbnail + Nome do Vídeo */}
            <div className="flex items-center gap-3 md:w-1/3">
              <div className="bg-muted relative h-16 w-24 shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={field.thumbnailUrl || "/logo.svg"}
                  alt={field.videoName || "Thumbnail"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                  Exercício #{index + 1}
                </span>
                <h4 className="line-clamp-2 text-sm leading-snug font-medium">
                  {field.videoName}
                </h4>
              </div>
            </div>

            {/* Grid dos Inputs (Séries, Reps, Sustentação, Frequência) */}
            <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Séries */}
              <Field>
                <FieldLabel className="text-xs">Séries</FieldLabel>
                <Controller
                  name={`exerciseVideos.${index}.sets`}
                  control={control}
                  render={({ field: inputField }) => (
                    <Input
                      type="number"
                      min={1}
                      placeholder="Ex: 3"
                      value={inputField.value ?? ""}
                      onChange={(e) =>
                        inputField.onChange(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    />
                  )}
                />
              </Field>

              {/* Repetições */}
              <Field>
                <FieldLabel className="text-xs">Reps</FieldLabel>
                <Controller
                  name={`exerciseVideos.${index}.reps`}
                  control={control}
                  render={({ field: inputField }) => (
                    <Input
                      type="number"
                      min={1}
                      placeholder="Ex: 10"
                      value={inputField.value ?? ""}
                      onChange={(e) =>
                        inputField.onChange(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    />
                  )}
                />
              </Field>

              {/* Isometria / Sustentação (Segundos) */}
              <Field>
                <FieldLabel className="text-xs">Isometria (s)</FieldLabel>
                <Controller
                  name={`exerciseVideos.${index}.holdTimeSec`}
                  control={control}
                  render={({ field: inputField }) => (
                    <Input
                      type="number"
                      min={0}
                      placeholder="Ex: 15s"
                      value={inputField.value ?? ""}
                      onChange={(e) =>
                        inputField.onChange(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    />
                  )}
                />
              </Field>

              {/* Frequência */}
              <Field>
                <FieldLabel className="text-xs">Frequência</FieldLabel>
                <Controller
                  name={`exerciseVideos.${index}.frequency`}
                  control={control}
                  render={({ field: inputField }) => (
                    <Input
                      placeholder="Ex: 2x ao dia"
                      value={inputField.value ?? ""}
                      onChange={inputField.onChange}
                    />
                  )}
                />
              </Field>
            </div>

            {/* Botão de Remover Exercício */}
            <div className="flex justify-end md:self-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                title="Remover exercício"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Erro Geral do Array se houver */}
      {errors.exerciseVideos?.message && (
        <p className="text-destructive text-xs font-medium">
          {errors.exerciseVideos.message}
        </p>
      )}

      {/* Dialog com a Lista de Seleção */}
      <DialogWorkoutList
        isOpen={isOpenDialogWorkoutList}
        onClose={() => setOpenDialogWorkoutList(false)}
        videos={videos}
        initialSelectedIds={fields.map((f) => f.videoId)}
        onConfirm={handleConfirmSelection}
      />
    </div>
  )
}

export default SessionWorkoutSelector
