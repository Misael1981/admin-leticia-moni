"use client"

import { saveCategory } from "@/app/action/save-caterory"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CategoryDTO } from "@/dtos/categories.dto"
import {
  CategoryFormInputValues,
  categorySchema,
} from "@/schemas/categories-products-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type CategoryFormProps = {
  category: CategoryDTO | null
  onDone: () => void // 👈 novo
}

const CategoryForm = ({ category, onDone }: CategoryFormProps) => {
  const [isPending, startTransition] = useTransition()

  const methods = useForm<CategoryFormInputValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  })

  useEffect(() => {
    methods.reset({
      name: category?.name ?? "",
      description: category?.description ?? "",
    })
  }, [category])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  async function onSubmit(values: CategoryFormInputValues) {
    startTransition(async () => {
      try {
        const formData = new FormData()

        if (category?.id) {
          formData.append("id", category.id)
        }
        formData.append("name", values.name)
        formData.append("description", values.description || "")

        const result = await saveCategory(formData)

        if (result.success) {
          if (!category?.id) {
            methods.reset({
              name: "",
              description: "",
            })
          } else {
            methods.reset(values)
          }
          toast.success("Categoria salva com sucesso!")
          onDone()
          console.log(result.message)
        } else {
          console.error(result.error)
          toast.error("Erro ao salvar a categoria")
        }
      } catch (error) {
        console.error("Erro no fluxo de salvamento:", error)
        toast.error("Ocorreu um erro inesperado.")
      }
    })
  }

  const buttonLabel = category?.id ? "Salvar Alterações" : "Cadastrar Categoria"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <input type="hidden" value={category?.id || ""} />
      <FieldGroup>
        <Field>
          <FieldLabel>Nome da Categoria</FieldLabel>
          <Input
            placeholder="Ex: Óleos, Produtos Ortopédicos, etc."
            {...register("name")}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Descrição da categoria</FieldLabel>
          <Textarea
            placeholder="Este campo é opcional."
            className="min-h-30 resize-none"
            {...register("description")}
          />
          <FieldError>{errors.description?.message}</FieldError>
        </Field>
      </FieldGroup>

      <div className="flex justify-center">
        <Button
          type="submit"
          size="lg"
          className="w-full max-w-lg"
          disabled={isPending}
        >
          <PlusCircle />
          {isPending ? "Salvando..." : buttonLabel}
        </Button>
      </div>
    </form>
  )
}

export default CategoryForm
