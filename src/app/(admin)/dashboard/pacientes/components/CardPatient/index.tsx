"use client"

import { deletePatient } from "@/app/action/update-patient"
import DialogDeleteItem from "@/components/DialogDeleteItem"
import GetStatusBadge from "@/components/GetStatusBadge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PatientStatus } from "@/constants/enums"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { generateWhatsAppLink } from "@/helpers/generate-whatsapp-link"
import { FileText, MoreVertical } from "lucide-react"
import { useState } from "react"
import { FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"

type CardPatientProps = {
  patient: {
    name: string
    id: string
    phone: string | null
    nickname: string | null
    avatarUrl: string | null
    cpf: string | null
    status: PatientStatus
  }
}

const CardPatient = ({ patient }: CardPatientProps) => {
  const [isOpenModalDelete, setOpenModalDelete] = useState(false)

  const handleOpenModalDelete = () => {
    setOpenModalDelete(true)
  }

  const handleConfirmDelete = async () => {
    try {
      const success = await deletePatient(patient.id)

      if (success) {
        setOpenModalDelete(false)
        toast.success("Paciente deletado com sucesso!")
      } else {
        toast.error("Ocorreu um erro ao deletar o paciente.")
        setOpenModalDelete(false)
      }
    } catch (error) {
      console.error("Erro ao deletar o paciente:", error)
      setOpenModalDelete(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex justify-between gap-4">
        <div className="flex items-center gap-2">
          {patient.avatarUrl && (
            <Avatar>
              <AvatarImage
                src={patient.avatarUrl}
                alt={patient.name}
                className="grayscale"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <div>
            <CardTitle>{patient.name}</CardTitle>
            <CardDescription>{patient.nickname}</CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost" })}>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              Ver Prontuário
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              Editar Cadastro
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex w-full justify-end">
          {GetStatusBadge(patient.status)}
        </div>

        {patient.phone && (
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-xs">
                Telefone / WhatsApp
              </span>
              <span className="text-sm font-semibold">
                {formatPhoneNumber(patient.phone)}
              </span>
            </div>

            <a
              href={generateWhatsAppLink(patient.phone, patient.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none active:bg-emerald-800"
            >
              <FaWhatsapp className="h-4 w-4" />
              <span>Enviar mensagem</span>
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center md:justify-end">
        <Button variant="destructive" onClick={handleOpenModalDelete}>
          Deletar Paciente
        </Button>
      </CardFooter>

      <DialogDeleteItem
        isOpen={isOpenModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleConfirmDelete}
        label="Deseja realmente deletar esse paciente? Essa ação é irreversível, você perderá todo o histórico do paciente."
      />
    </Card>
  )
}

export default CardPatient
