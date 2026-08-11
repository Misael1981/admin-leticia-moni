import { buttonVariants } from "@/components/ui/button"
import { PatientAuthType } from "@/data/patients.queries"
import { TabletSmartphone } from "lucide-react"
import Link from "next/link"

type ButtonAppAccessProps = {
  patientId: string
  patientAuth: PatientAuthType | null
}

const ButtonAppAccess = ({ patientId, patientAuth }: ButtonAppAccessProps) => {
  const editPin = Boolean(patientAuth?.pinHash)

  return (
    <Link
      href={`/dashboard/pacientes/${patientId}/app-acesso`}
      className={`gap-2 ${buttonVariants({ variant: "outline" })} w-full border-amber-200 text-amber-600 hover:text-amber-400 md:w-fit`}
    >
      <TabletSmartphone className="h-4 w-4" />
      {editPin ? "Editar Acesso ao App" : "Liberar Acesso ao App"}
    </Link>
  )
}

export default ButtonAppAccess
