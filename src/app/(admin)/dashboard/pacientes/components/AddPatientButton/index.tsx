import { buttonVariants } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import Link from "next/link"

const AddPatientButton = () => {
  return (
    <div className="flex w-full justify-end">
      <Link
        href="/dashboard/pacientes/cadastrar-paciente"
        className={buttonVariants({ variant: "default" })}
      >
        <CirclePlus />
        Add Paciente
      </Link>
    </div>
  )
}

export default AddPatientButton
