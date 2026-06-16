"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TriangleAlert } from "lucide-react"

type DialogDeleteItemProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  label: string
}

const DialogDeleteItem = ({
  isOpen,
  onClose,
  onConfirm,
  label,
}: DialogDeleteItemProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-90 max-w-[95%] rounded-md p-4 shadow-md">
        <TriangleAlert className="mx-auto mb-2 h-16 w-16 text-red-500" />
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-red-500">
            Atenção!
          </DialogTitle>
          <DialogDescription>{label}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Voltar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDeleteItem
