"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CreateAppointmentInput } from "@/schemas/appointment.schema"
import { Check, ChevronsUpDown, UserPlus } from "lucide-react"
import { useState } from "react"
import { Control, Controller, ControllerRenderProps } from "react-hook-form"

type PatientFieldProps = {
  control: Control<CreateAppointmentInput>
  error?: string
  patients: { id: string; name: string }[]
  setValue: (
    name: "patientId",
    value: string,
    options?: { shouldValidate?: boolean },
  ) => void
}

const PatientField = ({
  control,
  error,
  patients,
  setValue,
}: PatientFieldProps) => {
  const [openPatientCombobox, setOpenPatientCombobox] = useState(false)

  return (
    <Field>
      <FieldLabel>Paciente</FieldLabel>
      <Controller
        name="patientId"
        control={control}
        render={({
          field,
        }: {
          field: ControllerRenderProps<CreateAppointmentInput, "patientId">
        }) => (
          <Popover
            open={openPatientCombobox}
            onOpenChange={setOpenPatientCombobox}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !field.value && "text-muted-foreground",
                )}
              >
                {field.value
                  ? patients.find((p) => p.id === field.value)?.name
                  : "Buscar paciente..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-85 p-0" align="start">
              <Command>
                <CommandInput placeholder="Digite o nome do paciente..." />
                <CommandList>
                  <CommandEmpty className="p-2 text-center text-sm">
                    <p className="text-muted-foreground mb-2">
                      Paciente não encontrado.
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => {
                        alert("Abrir modal de novo paciente expresso!")
                      }}
                    >
                      <UserPlus className="h-4 w-4" />
                      Cadastrar Paciente Expresso
                    </Button>
                  </CommandEmpty>
                  <CommandGroup>
                    {patients.map((patient) => (
                      <CommandItem
                        key={patient.id}
                        value={patient.name}
                        onSelect={() => {
                          setValue("patientId", patient.id, {
                            shouldValidate: true,
                          })
                          setOpenPatientCombobox(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            patient.id === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {patient.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      />
      {error && <span className="text-destructive text-xs">{error}</span>}
    </Field>
  )
}

export default PatientField
