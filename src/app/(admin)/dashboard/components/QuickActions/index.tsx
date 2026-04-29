"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Send, ClipboardPlus } from "lucide-react"

type Action = {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  href?: string
}

type QuickActionsProps = {
  actions?: Action[]
}

const defaultActions: Action[] = [
  {
    label: "Cadastrar paciente",
    icon: <UserPlus size={18} />,
  },
  {
    label: "Enviar exercício",
    icon: <Send size={18} />,
  },
  {
    label: "Registrar atendimento",
    icon: <ClipboardPlus size={18} />,
  },
]

const QuickActions = ({ actions = defaultActions }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Acesso rápido</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex h-20 flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02]"
              onClick={action.onClick}
              asChild={!!action.href}
            >
              {action.href ? (
                <a href={action.href}>
                  {action.icon}
                  <span className="text-sm font-medium">{action.label}</span>
                </a>
              ) : (
                <>
                  {action.icon}
                  <span className="text-sm font-medium">{action.label}</span>
                </>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActions
