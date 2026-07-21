"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PatientPaginationProps {
  currentPage: number
  totalPages: number
}

const PatientPagination = ({
  currentPage,
  totalPages,
}: PatientPaginationProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const goToPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
      <p className="text-muted-foreground text-xs">
        Página{" "}
        <span className="font-semibold text-slate-800">{currentPage}</span> de{" "}
        <span className="font-semibold text-slate-800">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="h-8 gap-1 text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Anterior
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="h-8 gap-1 text-xs"
        >
          Próximo
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

export default PatientPagination
