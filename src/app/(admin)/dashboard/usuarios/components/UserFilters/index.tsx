"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { USER_ROLE_OPTIONS } from "@/constants/options"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"

const UserFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const searchFromUrl = searchParams.get("search") || ""
  const currentRole = searchParams.get("role") || "TODOS"

  // Estado local do input e estado de rastreamento da URL
  const [searchTerm, setSearchTerm] = useState(searchFromUrl)
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl)

  // Sincronização direta na renderização (sem useEffect)
  if (prevSearchFromUrl !== searchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl)
    setSearchTerm(searchFromUrl)
  }

  const updateFilters = useCallback(
    (search: string, role: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set("page", "1")

      if (search) {
        params.set("search", search)
      } else {
        params.delete("search")
      }

      if (role && role !== "TODOS") {
        params.set("role", role)
      } else {
        params.delete("role")
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [searchParams, pathname, router], // Dependências da função
  )

  // Agora você pode adicionar updateFilters no useEffect sem problemas!
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== searchFromUrl) {
        updateFilters(searchTerm, currentRole)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, currentRole, searchFromUrl, updateFilters])

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="relative w-full sm:max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-background pl-9"
        />
      </div>

      <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
        {isPending && (
          <span className="text-muted-foreground mr-2 animate-pulse text-xs">
            Buscando no banco...
          </span>
        )}
        <Select
          value={currentRole}
          onValueChange={(value) => updateFilters(searchTerm, value)}
        >
          <SelectTrigger className="bg-background w-full sm:w-45">
            <SelectValue placeholder="Filtrar por Perfil de Acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>

            {USER_ROLE_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default UserFilters
