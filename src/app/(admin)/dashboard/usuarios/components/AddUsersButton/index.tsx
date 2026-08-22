import { buttonVariants } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import Link from "next/link"

const AddUsersButton = () => {
  return (
    <div className="flex w-full justify-end">
      <Link
        href="/dashboard/usuarios/cadastrar-usuario"
        className={buttonVariants({ variant: "default" })}
      >
        <CirclePlus />
        Add Usuário
      </Link>
    </div>
  )
}

export default AddUsersButton
