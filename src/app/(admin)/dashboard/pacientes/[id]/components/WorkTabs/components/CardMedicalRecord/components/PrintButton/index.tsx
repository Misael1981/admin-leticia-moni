"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"

type PrintButtonProps = {
  contentRef: React.RefObject<HTMLDivElement | null>
}

export default function PrintButton({ contentRef }: PrintButtonProps) {
  const handlePrint = useReactToPrint({
    contentRef,
  })

  return (
    <Button onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" />
      Imprimir Resumo
    </Button>
  )
}
