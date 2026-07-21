"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTransition, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

const PatientFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Pegamos os valores atuais da URL para inicializar o estado do input
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const currentStatus = searchParams.get("status") || "TODOS"

  // Função central que atualiza a URL de forma atômica
  const updateFilters = (search: string, status: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Sempre que mudar o filtro, resetamos para a página 1 para evitar bugs de paginação vazia
    params.set("page", "1")

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    if (status && status !== "TODOS") {
      params.set("status", status)
    } else {
      params.delete("status")
    }

    // O startTransition avisa o Next.js que essa mudança de rota é uma transição de estado,
    // mantendo a UI responsiva enquanto o Server Component busca os dados no banco.
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  // Efeito de Debounce para o input de busca
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Só atualiza se o valor realmente mudou em relação à URL atual
      if (searchTerm !== (searchParams.get("search") || "")) {
        updateFilters(searchTerm, currentStatus)
      }
    }, 300) // 300 milissegundos de espera

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
      {/* Input de Busca com Ícone */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nome ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background pl-9"
        />
      </div>

      {/* Select de Status */}
      <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
        {isPending && (
          <span className="text-muted-foreground mr-2 animate-pulse text-xs">
            Buscando no banco...
          </span>
        )}
        <Select
          value={currentStatus}
          onValueChange={(value) => updateFilters(searchTerm, value)}
        >
          <SelectTrigger className="bg-background w-full sm:w-45">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos os Status</SelectItem>
            <SelectItem value="ACTIVE">Em Tratamento</SelectItem>
            <SelectItem value="DISCHARGED">Alta</SelectItem>
            <SelectItem value="INACTIVE">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default PatientFilters
