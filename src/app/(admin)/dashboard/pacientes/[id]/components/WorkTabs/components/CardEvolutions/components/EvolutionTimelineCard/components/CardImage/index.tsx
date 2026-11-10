"use client"

import { Download, Paperclip } from "lucide-react"
import Image from "next/image"

type CardImageProps = {
  image: {
    id: string
    imageUrl: string
    name: string | null
    description: string | null
  }
}

const CardImage = ({ image }: CardImageProps) => {
  const isPdf = image.imageUrl.toLowerCase().includes(".pdf")
  const fileName = image.name || `Imagem_${image.id}${isPdf ? ".pdf" : ".jpg"}`
  return (
    <div className="flex w-fit flex-col items-center gap-4 rounded-lg border p-4 shadow-sm lg:flex-row lg:items-start">
      <Image
        src={image.imageUrl}
        alt={image.name || "Imagem do paciente"}
        width={100}
        height={100}
        className="rounded-md object-cover"
      />

      <div className="flex flex-col justify-between gap-2 lg:flex-1">
        <div className="text-center lg:text-start">
          <h4 className="text-sm font-semibold">{image.name || "Sem nome"}</h4>
          <p className="text-muted-foreground text-xs">
            {image.description || "Sem descrição"}
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-2 rounded-lg border p-2.5 text-xs">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="text-muted-foreground h-4 w-4 shrink-0" />
            <span className="text-muted-foreground truncate font-medium">
              {fileName}
            </span>
          </div>

          <a
            href={image.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 font-medium text-slate-700 transition hover:text-blue-600"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Baixar Imagem</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default CardImage
