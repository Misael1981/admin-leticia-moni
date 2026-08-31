"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  CheckCircle2,
  Clock,
  Pencil,
  Sparkles,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { updateTestimonialAction } from "@/app/action/testimonials.actions"
// Importe a sua Server Action quando ela estiver criada
// import { updateTestimonialAction } from "@/actions/testimonials.actions"

interface TestimonialCardProps {
  testimonial: {
    name: string | null
    id: string
    quote: string
    recovery: string | null
    isPublished: boolean
    createdAt: Date
    patient: {
      name: string
      id: string
      nickname: string | null
    }
    displayOrder: number
    description: string | null
    thumbnail: string | null
    rating: number
    treatment: {
      name: string
    } | null
  }
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(!testimonial.isPublished)

  // Estados para o mini-formulário inline
  const [quote, setQuote] = useState(testimonial.quote || "")
  const [recovery, setRecovery] = useState(testimonial.recovery || "")
  const [isPublished, setIsPublished] = useState(testimonial.isPublished)

  const handleSaveAndPublish = (publishedStatus: boolean) => {
    startTransition(async () => {
      try {
        const response = await updateTestimonialAction({
          id: testimonial.id,
          quote,
          recovery,
          isPublished: publishedStatus,
        })

        setIsPublished(publishedStatus)
        if (publishedStatus) setIsEditing(false)
        if (response.success) {
          toast.success(
            publishedStatus
              ? "Depoimento aprovado e publicado com sucesso!"
              : "Depoimento salvo e ocultado da Landing Page.",
          )
        } else {
          toast.error("Erro ao atualizar o depoimento.")
        }
      } catch (error) {
        toast.error("Erro ao atualizar o depoimento.")
        console.log(error)
      }
    })
  }

  return (
    <Card
      id={testimonial.id}
      className={`transition-all ${isPublished ? "bg-card border-emerald-500/30" : "border-amber-500/30 bg-amber-500/5"}`}
    >
      {/* Informações do Paciente & Status */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={testimonial.thumbnail || undefined}
              alt={testimonial.name || "Nome do Usuário"}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {testimonial.name!.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm leading-none font-semibold">
                {testimonial.name}
              </h4>
              {testimonial.patient?.nickname && (
                <span className="text-muted-foreground text-xs">
                  ({testimonial.patient.nickname})
                </span>
              )}
            </div>
            {/* Estrelas do Rating */}
            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < testimonial.rating
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <Badge
          variant={isPublished ? "default" : "outline"}
          className={
            isPublished
              ? "gap-1 bg-emerald-600 text-white hover:bg-emerald-700"
              : "gap-1 border-amber-500 text-amber-600 dark:text-amber-400"
          }
        >
          {isPublished ? (
            <>
              <CheckCircle2 className="h-3 w-3" /> Publicado
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" /> Pendente
            </>
          )}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Exibe o tratamento vinculado se existir */}
        {testimonial.treatment?.name && (
          <Badge variant="outline" className="text-xs">
            Tratamento: {testimonial.treatment.name}
          </Badge>
        )}
        {/* Relato completo enviado pelo paciente */}
        <div className="bg-muted/50 text-muted-foreground border-border/40 rounded-md border p-3 italic">
          {testimonial.description}
        </div>

        {/* MODO 1: Mini-Formulário Inline (Pendente de Aprovação ou Edição manual) */}
        {isEditing ? (
          <div className="bg-background space-y-3 rounded-lg border p-4 shadow-sm">
            <div className="text-primary mb-1 flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Ajustes para a Landing Page
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`quote-${testimonial.id}`} className="text-xs">
                Frase de Destaque (Quote)
              </Label>
              <Input
                id={`quote-${testimonial.id}`}
                placeholder="Ex: Voltei a correr sem dores após 8 sessões!"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="bg-background text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`recovery-${testimonial.id}`} className="text-xs">
                Conquista / Diagnóstico Clínico (Recovery)
              </Label>
              <Input
                id={`recovery-${testimonial.id}`}
                placeholder="Ex: Reabilitação de Joelho - LCA (12 Sessões)"
                value={recovery}
                onChange={(e) => setRecovery(e.target.value)}
                className="bg-background text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {isPublished && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => handleSaveAndPublish(true)}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Salvar & Publicar Depoimento"
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* MODO 2: Leitura estilizada (Já aprovado) */
          <div className="bg-background/60 flex flex-col gap-2 rounded-lg border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-foreground text-xs font-medium">
                  <span className="text-muted-foreground font-normal">
                    Destaque:
                  </span>{" "}
                  {quote}
                </p>
                {recovery && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-normal"
                  >
                    {recovery}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-7 w-7"
                onClick={() => setIsEditing(true)}
                title="Editar destaque e tratamento"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer com Switch de publicação rápida (caso já esteja publicado) */}
      {!isEditing && (
        <CardFooter className="bg-muted/20 flex items-center justify-between border-t px-6 py-3">
          <span className="text-muted-foreground text-xs">
            Exibir na Landing Page
          </span>
          <div className="flex items-center gap-2">
            <Switch
              checked={isPublished}
              disabled={isPending}
              onCheckedChange={(checked) => handleSaveAndPublish(checked)}
            />
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
