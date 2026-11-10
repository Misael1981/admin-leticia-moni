"use client"

import { useState, useTransition } from "react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import {
  deleteNotesPostSessions,
  updateNotesPostSessions,
} from "@/app/action/treatment/notes-post-session.action"
import { toast } from "sonner"
import DialogDeleteItem from "@/components/DialogDeleteItem"

type NotesPostSessionsProps = {
  initialNotes: string | null
  sessionId: string
  patientId: string
}

const NotesPostSessions = ({
  initialNotes = "",
  sessionId,
  patientId,
}: NotesPostSessionsProps) => {
  const [notes, setNotes] = useState(initialNotes || "")
  const [isEditing, setIsEditing] = useState(!initialNotes)
  const [isPending, startTransition] = useTransition()
  const [isOpenModalDelete, setOpenModalDelete] = useState(false)

  const handleSave = () => {
    startTransition(async () => {
      const response = await updateNotesPostSessions({
        sessionId,
        notes,
        patientId,
      })

      if (response.success) {
        toast.success(response.message)
        setIsEditing(false)
      } else {
        toast.error(response.message)
        setIsEditing(true)
      }
    })
  }

  const handleOpenModalDelete = () => {
    setOpenModalDelete(true)
  }

  const handleConfirmDelete = () => {
    startTransition(async () => {
      const response = await deleteNotesPostSessions(sessionId, patientId)

      if (response.success) {
        setOpenModalDelete(false)
        toast.success(response.message)
        setNotes("")
        setIsEditing(true)
      } else {
        toast.error(response.message)
        setOpenModalDelete(false)
      }
    })
  }

  const handleCancel = () => {
    setNotes(initialNotes || "")
    setIsEditing(false)
  }

  return (
    <>
      <Field className="space-y-2">
        <div className="flex items-center justify-between">
          <FieldLabel className="text-sm font-medium">
            Notas Pós Consulta
          </FieldLabel>

          {/* Botões de Ação para Nota Existente */}
          {!isEditing && notes && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 gap-1 text-xs"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleOpenModalDelete}
                disabled={isPending}
                className="text-destructive hover:text-destructive h-8 gap-1 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </Button>
            </div>
          )}
        </div>

        {/* Modo de Leitura vs Modo de Edição */}
        {!isEditing && notes ? (
          <div className="bg-muted/30 text-foreground rounded-lg border p-3 text-sm leading-relaxed whitespace-pre-wrap">
            {notes}
          </div>
        ) : (
          <div className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Digite as observações da sessão..."
              className="min-h-24 resize-y"
            />

            <div className="flex justify-end gap-2">
              {initialNotes && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? "Salvando..." : "Salvar Nota"}
              </Button>
            </div>
          </div>
        )}
      </Field>

      <DialogDeleteItem
        isOpen={isOpenModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        label="Deseja realmente deletar essa nota? Essa ação é irreversível!"
      />
    </>
  )
}

export default NotesPostSessions
