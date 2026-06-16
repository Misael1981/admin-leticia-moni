"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const SearchProduct = () => {
  return (
    <div className="mx-auto flex w-full max-w-lg justify-between gap-2">
      <Input placeholder="Buscar Produto" />
      <Button>
        <Search />
      </Button>
    </div>
  )
}

export default SearchProduct
