"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form"
import {
  CreateUserInput,
  createUserSchema,
  CreateUserValues,
} from "@/schemas/users-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import UserForm from "@/components/UserForm"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

const UserFormRegister = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      role: "USER",
      image: "",
    },
  })

  const { handleSubmit } = methods

  const onSubmit = async (data: CreateUserValues) => {
    startTransition(async () => {
      console.log(data)
      router.push("/dashboard/usuarios")
    })
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle>Dados no novo usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              <UserPlus />
              {isPending ? "Salvando..." : "Cadastrar Usuário"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}

export default UserFormRegister
