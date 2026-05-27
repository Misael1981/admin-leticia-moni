"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

type CardTreatmentProps = {
  treatment: {
    id: string
    name: string | null
    description: string | null
  }
}

const CardTreatment = ({ treatment }: CardTreatmentProps) => {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{treatment.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {treatment.description || "Sem descrição disponível."}
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href={`/dashboard/tratamentos/${treatment.id}`}>
          <Button>Editar</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
export default CardTreatment
