"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"

const TestimonialsFilters = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const searchFromUrl = searchParams.get("search") || ""
  const currentStatus = searchParams.get("isPublished") || "TODOS"

  const [searchTerm, setSearchTerm] = useState(searchFromUrl)
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl)

  if (prevSearchFromUrl !== searchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl)
    setSearchTerm(searchFromUrl)
  }

  const updateFilters = useCallback(
    (search: string, status: string) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set("page", "1")

      if (search.trim()) {
        params.set("search", search.trim())
      } else {
        params.delete("search")
      }

      if (status && status !== "TODOS") {
        params.set("isPublished", status)
      } else {
        params.delete("isPublished")
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [searchParams, pathname, router],
  )

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== searchFromUrl) {
        updateFilters(searchTerm, currentStatus)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, currentStatus, searchFromUrl, updateFilters])

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="relative w-full sm:max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar por nome ou apelido..."
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
          value={currentStatus}
          onValueChange={(value) => updateFilters(searchTerm, value)}
        >
          <SelectTrigger className="bg-background w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="TODOS">Todos os status</SelectItem>
            <SelectItem value="true">Publicados</SelectItem>
            <SelectItem value="false">Não publicados</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default TestimonialsFilters
