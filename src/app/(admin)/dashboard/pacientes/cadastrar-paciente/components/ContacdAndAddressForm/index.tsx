import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { formatPhoneNumber } from "@/helpers/format-phone-number"
import { PatientFormValues } from "@/schemas/patients-schemas"
import Link from "next/link"
import { useFormContext } from "react-hook-form"

const ContacdAndAddressForm = () => {
  const form = useFormContext<PatientFormValues>()
  const {
    register,
    formState: { errors },
  } = form

  return (
    <Card className="w-full max-w-5xl">
      <CardHeader className="border-b-2 pb-6">
        <CardTitle>Contato e Endereço</CardTitle>
        <CardDescription>
          Informações para comunicação com o paciente e localização de sua
          residência.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field>
              <FieldLabel>Telefone de Contato</FieldLabel>
              <Input
                {...register("phone")}
                placeholder="00 0 0000-0000"
                onChange={(e) => {
                  e.target.value = formatPhoneNumber(e.target.value)
                }}
              />
              <FieldError>{errors.phone?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>E-mail Pessoal</FieldLabel>
              <Input placeholder="Campo opcional" {...register("email")} />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            <div className="bg-muted/20 space-y-3 rounded-lg border border-amber-500 p-4 lg:col-span-2">
              <h3 className="text-foreground text-sm font-semibold">
                Contato de Emergência
              </h3>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field>
                  <FieldLabel>Nome</FieldLabel>
                  <Input
                    placeholder="Nome do Contato"
                    {...register("emergencyContactName")}
                  />
                  <FieldError>
                    {errors.emergencyContactName?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Telefone</FieldLabel>
                  <Input
                    {...register("emergencyContactPhone")}
                    placeholder="Telefone do Contato"
                    onChange={(e) => {
                      e.target.value = formatPhoneNumber(e.target.value)
                    }}
                  />
                  <FieldError>
                    {errors.emergencyContactPhone?.message}
                  </FieldError>
                </Field>
              </div>
            </div>

            <div className="flex gap-4 lg:col-span-2">
              <Field>
                <FieldLabel>Rua</FieldLabel>
                <Input
                  placeholder="Ex: rua Principal"
                  {...register("address.street")}
                />
                <FieldError>{errors.address?.street?.message}</FieldError>
              </Field>

              <Field className="w-1/4">
                <FieldLabel>Número</FieldLabel>
                <Input {...register("address.number")} />
                <FieldError>{errors.address?.number?.message}</FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel>Complemento</FieldLabel>
              <Input {...register("address.complement")} />
              <FieldError>{errors.address?.complement?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Bairro</FieldLabel>
              <Input {...register("address.district")} />
              <FieldError>{errors.address?.district?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Cidade</FieldLabel>
              <Input {...register("address.city")} />
              <FieldError>{errors.address?.city?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Estado</FieldLabel>
              <Input {...register("address.state")} />
              <FieldError>{errors.address?.state?.message}</FieldError>
            </Field>

            <div className="flex justify-center lg:col-span-2">
              <Field className="w-full max-w-lg">
                <div className="mb-2 flex items-center justify-between">
                  <FieldLabel>CEP</FieldLabel>
                  <Link
                    href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-500 hover:underline"
                  >
                    Não sei meu CEP
                  </Link>
                </div>
                <Input
                  placeholder="00000-000"
                  {...register("address.zipCode")}
                />
                <FieldError>{errors.address?.zipCode?.message}</FieldError>
              </Field>
            </div>
          </div>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export default ContacdAndAddressForm
