import { TreatmentForAnamnesisType } from "@/data/get-treatments"
import { Control, FieldValues, Path, useController } from "react-hook-form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type MultiSelectProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  options: TreatmentForAnamnesisType[]
}

export function MultiSelect<T extends FieldValues>({
  control,
  name,
  options,
}: MultiSelectProps<T>) {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name,
  })

  const selected: string[] = value ?? []

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className="flex justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full max-w-xl">
            {selected.length > 0
              ? `${selected.length} tratamentos selecionados`
              : "Selecione um ou mais tratamentos"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <Command className="max-w-xl space-y-4 rounded-lg border">
            <CommandInput placeholder="Busque um tratamento..." />
            <CommandList>
              {options.map((treatment) => (
                <CommandItem
                  key={treatment.id}
                  onSelect={() => toggle(treatment.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(treatment.id)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />

                  {treatment.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
