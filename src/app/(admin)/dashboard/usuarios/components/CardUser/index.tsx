"use client"

import { deleteUser } from "@/app/action/users.action"
import DialogDeleteItem from "@/components/DialogDeleteItem"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { USER_ROLE_LABELS } from "@/constants/labels"
import { UserType } from "@/data/get-users-queries"
import { formatDate } from "@/helpers/format-date"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

type CardUserProps = {
  user: UserType
}

const CardUser = ({ user }: CardUserProps) => {
  const [copiedField, setCopiedField] = useState<"email" | "phone" | null>(null)
  const [isOpenModalDelete, setOpenModalDelete] = useState(false)

  const handleOpenModalDelete = () => {
    setOpenModalDelete(true)
  }

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

  const handleConfirmDelete = async () => {
    try {
      const success = await deleteUser(user.id)

      if (success) {
        setOpenModalDelete(false)
        toast.success("Usuário deletado com sucesso!")
      } else {
        toast.error("Ocorreu um erro ao deletar o usuário.")
        setOpenModalDelete(false)
      }
    } catch (error) {
      console.error("Erro ao deletar o usuário:", error)
      setOpenModalDelete(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((name) => name[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="truncate">{user.name}</CardTitle>
          </div>
        </div>
        <Badge className="mt-1">{USER_ROLE_LABELS[user.role]}</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-end text-center">
          <div>
            <p className="text-muted-foreground text-xs">Cadastrado em</p>
            <p className="text-sm">{formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
          <div>
            <p className="text-muted-foreground text-xs">E-mail</p>
            <p className="truncate text-sm">{user.email}</p>
          </div>

          <Button
            variant="outline"
            onClick={() => handleCopy(user.email, "email")}
            disabled={!user.email || copiedField === "email"}
          >
            {copiedField === "email" ? "Copiado!" : "Copiar E-mail"}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
          <div>
            <p className="text-muted-foreground text-xs">Telefone</p>
            <p className="text-sm">{user.phone ?? "Não informado"}</p>
          </div>
          {user.phone && (
            <Button
              variant="outline"
              onClick={() => handleCopy(user.phone!, "phone")}
              disabled={copiedField === "phone"}
            >
              {copiedField === "phone" ? "Copiado!" : "Copiar Telefone"}
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 md:flex-row md:justify-end">
        <Link
          href={`/dashboard/usuarios/${user.id}`}
          className={`w-full md:w-fit ${buttonVariants({ variant: "default" })}`}
        >
          Editar
        </Link>

        <Button
          className="w-full md:w-fit"
          variant="destructive"
          onClick={handleOpenModalDelete}
        >
          Deletar Usuário
        </Button>
      </CardFooter>

      <DialogDeleteItem
        isOpen={isOpenModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        label="Deseja realmente deletar esse usuário? Essa ação é irreversível."
      />
    </Card>
  )
}

export default CardUser
