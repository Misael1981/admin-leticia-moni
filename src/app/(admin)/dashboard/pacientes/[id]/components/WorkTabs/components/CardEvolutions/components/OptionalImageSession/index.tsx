"use client"

import ImageUpload from "@/components/ImageUpload"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EvolutionFormInput } from "@/schemas/patients-schemas"
import { ImagePlus, PlusCircle, Trash2 } from "lucide-react"
import { useFieldArray, useFormContext } from "react-hook-form"

const OptionalImageSession = () => {
  const methods = useFormContext<EvolutionFormInput>()
  const {
    control,
    register,
    formState: { errors },
  } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  })

  return (
    <div className="bg-card space-y-4 rounded-xl border p-4 shadow-sm">
      <div className="flex flex-col items-center justify-center gap-2 border-b pb-3 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <ImagePlus className="text-primary h-5 w-5" />
          <h3 className="font-heading text-foreground text-lg font-semibold">
            Imagens
          </h3>
        </div>

        <Button
          type="button"
          onClick={() =>
            append({ imageUrl: "", name: "", description: "", fileKey: "" })
          }
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar Imagem
        </Button>
      </div>

      {fields.map((field, index) => {
        const imageErrors = errors.images?.[index]

        return (
          <div
            key={field.id}
            className="relative space-y-4 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Foto #{index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive gap-1"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
                Remover
              </Button>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel>Título para a Imagem</FieldLabel>
                <Input
                  placeholder="Ex: Exame de Ressonância..."
                  {...register(`images.${index}.name`)}
                />
                <FieldError>{imageErrors?.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Descrição</FieldLabel>
                <Textarea
                  className="min-h-24 resize-y"
                  placeholder="Descrição da imagem ou observação..."
                  {...register(`images.${index}.description`)}
                />
                <FieldError>{imageErrors?.description?.message}</FieldError>
              </Field>

              <Field className="w-full max-w-xl">
                <FieldLabel>Imagem à ser enviada</FieldLabel>
                <ImageUpload
                  form={methods}
                  name={`images.${index}.imageUrl`}
                  initialUrl={field.imageUrl}
                />
                <FieldError>{imageErrors?.imageUrl?.message}</FieldError>
              </Field>
            </FieldGroup>
          </div>
        )
      })}
    </div>
  )
}

export default OptionalImageSession
