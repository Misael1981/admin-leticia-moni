"use client"

import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

type SearchVideoProps = {
  value: string
  onChange: (value: string) => void
}

const SearchVideo = ({ value, onChange }: SearchVideoProps) => {
  return (
    <div className="relative w-full">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busque pelo nome do treino..."
        className="pr-9 pl-9"
      />

      {/* Botãozinho rápido para limpar a busca */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default SearchVideo
