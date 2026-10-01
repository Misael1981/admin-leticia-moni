"use client"

import { Controller, useFormContext, useWatch } from "react-hook-form"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"

type CurrencyInputProps = {
  name: string
  label: string
  placeholder?: string
  disabled?: boolean
}

const formatCurrency = (val: number) =>
  val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

export function CurrencyInput({
  name,
  label,
  placeholder = "R$ 0,00",
  disabled = false,
}: CurrencyInputProps) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext()

  const subtotal = useWatch({ control, name: "subtotal", defaultValue: 0 })
  const discount = useWatch({ control, name: "discount", defaultValue: 0 })

  // Recalcula o total automaticamente quando subtotal ou discount mudam
  useEffect(() => {
    const calculatedTotal = Math.max(0, Number(subtotal) - Number(discount))
    setValue("total", calculatedTotal, { shouldValidate: true })
  }, [subtotal, discount, setValue])

  const fieldError = errors[name]?.message as string | undefined

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const numericValue =
          typeof field.value === "number"
            ? field.value
            : typeof field.value === "string" && !isNaN(Number(field.value))
              ? Number(field.value)
              : 0

        const displayedValue =
          numericValue > 0 ? formatCurrency(numericValue) : ""

        return (
          <Field>
            <FieldLabel>{label}</FieldLabel>
            <Input
              type="text"
              inputMode="decimal"
              disabled={disabled}
              placeholder={placeholder}
              value={displayedValue}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "")

                if (!onlyDigits) {
                  field.onChange(0)
                  return
                }

                const parsedNumber = parseFloat(onlyDigits) / 100
                field.onChange(parsedNumber)
              }}
              onBlur={field.onBlur}
            />
            <FieldError>{fieldError}</FieldError>
          </Field>
        )
      }}
    />
  )
}
