"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Action = {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  href?: string
}

type QuickActionsProps = {
  actions: Action[]
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Acesso rápido</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action, index) => {
            const content = (
              <>
                {action.icon}
                <span className="text-sm font-medium">{action.label}</span>
              </>
            )

            if (action.href) {
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="flex h-20 flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02]"
                  asChild
                >
                  <Link href={action.href}>{content}</Link>
                </Button>
              )
            }

            return (
              <Button
                key={index}
                variant="outline"
                className="flex h-20 flex-col items-center justify-center gap-2 text-center transition-all hover:scale-[1.02]"
                onClick={action.onClick}
              >
                {content}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActions
