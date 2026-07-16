"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  BusinessHoursFormData,
  businessHoursSchema,
} from "@/schemas/clinic-settings-schema"
import DayCard from "../DayCard"
import { updateBusinessHours } from "@/app/action/update-business-hours"
import { BusinessHoursDTO, TimeSlotDTO } from "@/dtos/clinic.dto"

type OpeningHoursProps = {
  openingHours: BusinessHoursDTO[]
}

const OpeningHours = ({ openingHours }: OpeningHoursProps) => {
  const formattedHours = useMemo(
    () =>
      (openingHours ?? [])
        .map((bh) => ({
          dayOfWeek: bh.dayOfWeek,
          isClosed: bh.isClosed,
          timeSlots: (bh.timeSlots as unknown as TimeSlotDTO[]) ?? [],
        }))
        .sort((a, b) => a.dayOfWeek - b.dayOfWeek),
    [openingHours],
  )

  const defaultWeek = Array.from({ length: 7 }, (_, index) => ({
    dayOfWeek: index,
    isClosed: true,
    timeSlots: [],
  }))

  const mergedWeek = defaultWeek.map((defaultDay) => {
    const fromDb = formattedHours.find(
      (d) => d.dayOfWeek === defaultDay.dayOfWeek,
    )
    return fromDb ?? defaultDay
  })

  const methods = useForm<BusinessHoursFormData>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: {
      businessHours: mergedWeek,
    },
  })

  useEffect(() => {
    if (formattedHours.length > 0) {
      methods.reset({
        businessHours: formattedHours,
      })
    }
  }, [formattedHours, methods])

  const { isSubmitting } = methods.formState

  const onSubmit = async (data: BusinessHoursFormData) => {
    try {
      const result = await updateBusinessHours(data)
      if (result.success) {
        toast.success("Horários atualizados com sucesso")
      } else {
        toast.error(result.error || "Falha ao atualizar horários")
      }
    } catch (err) {
      console.error(err)
      toast.error("Erro inesperado ao salvar horários")
    }
  }

  return (
    <Card className="w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle>Gerencie seu horários de funcionamento</CardTitle>
        <CardDescription>
          Lembre-se, os horários serão exibidos na página principal, na agenda,
          e enviados para os pacientes já cadastrados. Mantenha o formulário
          atualizado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            id="business-hours-form"
            className="space-y-4"
          >
            {methods.getValues("businessHours").map((_, dayIndex) => (
              <DayCard
                key={dayIndex}
                dayIndex={dayIndex}
                control={methods.control}
              />
            ))}
          </form>
        </FormProvider>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-6">
        <Button
          type="submit"
          form="business-hours-form"
          className="w-full min-w-32 md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Atualizando..." : "Atualizar Horários"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default OpeningHours
