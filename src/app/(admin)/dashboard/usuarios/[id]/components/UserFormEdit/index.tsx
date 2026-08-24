"use client"

import { updateUserAction } from "@/app/action/users.action"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import UserForm from "@/components/UserForm"
import { UserType } from "@/data/get-users-queries"
import { userFormSchema, UserFormValues } from "@/schemas/users-schemas"

import { uploadToCloudinaryClient } from "@/services/image-compresseion.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserPen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

type UserFormEditProps = {
  user: UserType | null
}

const UserFormEdit = ({ user }: UserFormEditProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      role: user?.role || "USER",
      image: user?.image || "",
    },
  })

  const { handleSubmit } = methods

  const onSubmit = async (data: UserFormValues) => {
    if (!user?.id) {
      toast.error("ID do usuário não foi encontrado para atualização.")
      return
    }

    startTransition(async () => {
      try {
        let finalImageUrl = ""

        const imageValue = data.image as unknown

        if (imageValue instanceof File) {
          const uploadResult = await uploadToCloudinaryClient(imageValue)
          finalImageUrl = uploadResult.url
        } else if (typeof data.image === "string") {
          finalImageUrl = data.image
        }

        const response = await updateUserAction(user.id, {
          ...data,
          image: finalImageUrl,
        })

        if (response.success) {
          toast.success("Usuário atualizado com sucesso!")
          router.push("/dashboard/usuarios")
        } else {
          console.error(response.error)
          toast.error(response.error || "Erro ao atualizar usuário!")
        }
      } catch (error) {
        console.error("Erro ao atualizar usuário:", error)
        toast.error("Ocorreu um erro ao atualizar o usuário.")
      }
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle>Editar dados do usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              <UserPen />
              {isPending ? "Salvando..." : "Editar Cadastro"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}

export default UserFormEdit
