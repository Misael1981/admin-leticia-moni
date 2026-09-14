"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { toast } from "sonner"

type PhysiotherapistCardProps = {
  physiotherapist: {
    name: string
    id: string
    phone: string | null
    clinicId: string
    description: string | null
    imageUrl: string | null
    crefito: string | null
  }
}

const PhysiotherapistCard = ({ physiotherapist }: PhysiotherapistCardProps) => {
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(null)

  const handleCopy = async (value: string, field: "email" | "phone") => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      toast.success(
        `${field === "email" ? "E-mail" : "Telefone"} copiado com sucesso!`,
      )

      setTimeout(() => setCopiedField(null), 1500)
    } catch (error) {
      console.error("Erro ao copiar para a área de transferência:", error)
      toast.error(
        `Não foi possível copiar o ${field === "email" ? "e-mail" : "telefone"}.`,
      )
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={physiotherapist.imageUrl ?? undefined}
            alt={physiotherapist.name}
          />
          <AvatarFallback>
            {physiotherapist.name
              .split(" ")
              .map((name) => name[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <CardTitle className="truncate">{physiotherapist.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
          <div>
            <p className="text-muted-foreground text-xs">Telefone</p>
            <p className="text-sm">
              {physiotherapist.phone ?? "Não informado"}
            </p>
          </div>
          {physiotherapist.phone && (
            <Button
              variant="outline"
              onClick={() => handleCopy(physiotherapist.phone!, "phone")}
              disabled={copiedField === "phone"}
            >
              {copiedField === "phone" ? "Copiado!" : "Copiar Telefone"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default PhysiotherapistCard
