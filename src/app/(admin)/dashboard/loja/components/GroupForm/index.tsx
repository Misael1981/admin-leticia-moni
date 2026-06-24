"use client"

import { saveGroup } from "@/app/action/save-group"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProductGroupDTO } from "@/dtos/categories.dto"
import {
  ProductsGroupFormInputValues,
  productsGroupSchema,
} from "@/schemas/categories-products-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusCircle } from "lucide-react"
import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type GroupFormProps = {
  group: ProductGroupDTO | null
  onDone: () => void
  selectedCategoryId: string
}

const GroupForm = ({ group, onDone, selectedCategoryId }: GroupFormProps) => {
  const [isPending, startTransition] = useTransition()

  const methods = useForm<ProductsGroupFormInputValues>({
    resolver: zodResolver(productsGroupSchema),
    defaultValues: { name: "", description: "" },
  })

  useEffect(() => {
    methods.reset({
      name: group?.name ?? "",
      description: group?.description ?? "",
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods

  async function onSubmit(values: ProductsGroupFormInputValues) {
    startTransition(async () => {
      try {
        const formData = new FormData()

        if (group?.id) {
          formData.append("id", group.id)
        }

        formData.append("categoryId", selectedCategoryId)
        formData.append("name", values.name)
        formData.append("description", values.description || "")

        const result = await saveGroup(formData)

        if (result.success) {
          if (!group?.id) {
            methods.reset({
              name: "",
              description: "",
            })
          } else {
            methods.reset(values)
          }
          toast.success("Grupo salvo com sucesso!")
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

  const buttonLabel = group?.id ? "Salvar Alterações" : "Cadastrar Grupo"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <input type="hidden" value={group?.id || ""} />
      <input type="hidden" name="categoryId" value={selectedCategoryId ?? ""} />
      <FieldGroup>
        <Field>
          <FieldLabel>Nome do Grupo de Produtos</FieldLabel>
          <Input
            placeholder="Ex: Linha Adulta, Linha Infantil..."
            {...register("name")}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel>Descrição do Grupo</FieldLabel>
          <Textarea
            placeholder="Uma pequena descrição sobre o grupo de produtos."
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

export default GroupForm
