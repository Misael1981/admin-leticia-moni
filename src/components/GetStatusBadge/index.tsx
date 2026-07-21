import { UserCheck, UserMinus, UserX } from "lucide-react"
import { Badge } from "../ui/badge"

const GetStatusBadge = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-emerald-200 bg-emerald-50 font-medium text-emerald-700"
        >
          <UserCheck className="h-3 w-3" /> Em Tratamento
        </Badge>
      )
    case "DISCHARGED":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-blue-200 bg-blue-50 font-medium text-blue-700"
        >
          <UserMinus className="h-3 w-3" /> Alta
        </Badge>
      )
    case "INACTIVE":
      return (
        <Badge
          variant="outline"
          className="gap-1 border-slate-200 bg-slate-50 font-medium text-slate-600"
        >
          <UserX className="h-3 w-3" /> Inativo
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default GetStatusBadge
