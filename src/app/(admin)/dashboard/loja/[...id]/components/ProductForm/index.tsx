"use client"

import { saveProduct } from "@/app/action/save-product"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import UploadMultipleImages from "@/components/UploadMultipleImages"
import { ProductDTO } from "@/dtos/categories.dto"
import { formatCurrency } from "@/helpers/format-currency"
import {
  ProductFormInputValues,
  productSchema,
} from "@/schemas/categories-products-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

type ProductFormProps = {
  product?: ProductDTO | null
  defaultCategoryId?: string | undefined
}

const ProductForm = ({ product, defaultCategoryId }: ProductFormProps) => {
  const router = useRouter()

  const methods = useForm({
    resolver: zodResolver(productSchema),
    values: {
      name: product?.name || "",
      description: product?.description || "",
      indications: product?.indications || "",
      benefits: product?.benefits || "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      sku: product?.sku || "",
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      images: product?.images || [],
    },
  })

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting, errors },
  } = methods

  const isFeaturedValue = useWatch({
    control,
    name: "isFeatured",
  })

  async function onSubmit(values: ProductFormInputValues) {
    try {
      const dataToSend = {
        ...values,
        id: product?.id || null,
      }

      const response = await saveProduct({
        data: dataToSend,
        categoryId: defaultCategoryId,
      })

      if (response.success) {
        toast.success(response.message)
        router.push("/dashboard/loja")

        if (!product?.id) {
          methods.reset()
        }
      } else {
        console.error(response.error)
        toast.error(response.error || "Erro ao salvar o produto")
      }
    } catch (error) {
      console.error("Erro ao processar submit do produto:", error)
      toast.error("Erro ao processar submit do produto")
    }
  }

  const labelButton = product?.id ? "Editar Produto" : "Cadastrar Produto"

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup className="space-y-4">
            {/* Destaque */}
            <div className="flex justify-end">
              <Field orientation="horizontal" className="w-fit">
                <Switch
                  checked={isFeaturedValue}
                  onCheckedChange={(checked) =>
                    methods.setValue("isFeatured", checked)
                  }
                />
                <FieldLabel
                  className={
                    isFeaturedValue
                      ? "text-yellow-600 transition-colors"
                      : "transition-colors"
                  }
                >
                  {isFeaturedValue ? "Em destaque" : "Destacar Produto"}
                </FieldLabel>
              </Field>
            </div>
            {/* Nome do Produto e CodRef*/}
            <div className="flex flex-col gap-4 lg:flex-row">
              <Field>
                <FieldLabel>Nome do Produto</FieldLabel>
                <Input
                  placeholder="Ex: Meu Blend, Respira Bem, etc"
                  {...register("name")}
                />
                <FieldError>{errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel>CodRef</FieldLabel>
                <Input
                  placeholder="(Opcional) Ex: 001, 002, etc"
                  {...register("sku")}
                />
              </Field>
            </div>

            {/* Preço e Estoque */}
            <div className="flex flex-col gap-4 lg:flex-row">
              <Controller
                control={control}
                name="price"
                render={({ field }) => {
                  const numericValue =
                    typeof field.value === "number" ? field.value : 0

                  const displayedValue =
                    numericValue > 0 ? formatCurrency(numericValue) : ""

                  return (
                    <Field>
                      <FieldLabel>Preço do Produto</FieldLabel>
                      <Input
                        placeholder="R$ 0,00 (Opcional)"
                        value={displayedValue}
                        onChange={(e) => {
                          const inputValue = e.target.value

                          const onlyDigits = inputValue.replace(/\D/g, "")

                          if (!onlyDigits) {
                            field.onChange(0)
                            return
                          }

                          const parsedNumber = parseFloat(onlyDigits) / 100
                          field.onChange(parsedNumber)
                        }}
                      />
                      <FieldError>{errors.price?.message}</FieldError>
                    </Field>
                  )
                }}
              />

              <Field className="lg:w-1/3">
                <FieldLabel>Quantidade em Estoque</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Opcional"
                    {...register("stock")}
                  />
                  <span>unidades</span>
                </div>
              </Field>
            </div>

            {/* Descrição do Produto */}
            <Field>
              <FieldLabel>Descrição do Produto</FieldLabel>
              <Textarea
                placeholder="Descrição simples do Produto..."
                className="min-h-30 resize-none"
                {...register("description")}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>

            {/* Indicações e Benefícios */}
            <div className="flex flex-col gap-4 lg:flex-row">
              <Field>
                <FieldLabel>Indicações do Produto</FieldLabel>
                <Textarea
                  placeholder="Campo Opcional"
                  className="min-h-20 resize-none"
                  {...register("indications")}
                />
              </Field>

              <Field>
                <FieldLabel>Benefícios do Produto</FieldLabel>
                <Textarea
                  placeholder="Campo Opcional"
                  className="min-h-20 resize-none"
                  {...register("benefits")}
                />
              </Field>
            </div>

            {/* Imagem do Produto */}
            <Field>
              <FieldLabel>Imagem de Capa</FieldLabel>
              <UploadMultipleImages
                name="images"
                form={methods}
                initialUrl={product?.images?.[0]?.url}
              />
              <FieldError>{errors.images?.message}</FieldError>
            </Field>
          </FieldGroup>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : labelButton}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductForm
