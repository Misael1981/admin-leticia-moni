import AppSidebar from "@/components/AppSidebar"
import BreadcrumbDashboarding from "@/components/BreadcrumbDashboarding"
import ModeToggle from "@/components/ModeToggle"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const ALLOWED_ROLES = ["ADMIN", "OWNER"]

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const role = session.user?.role
  if (!role || !ALLOWED_ROLES.includes(role)) {
    redirect("/acesso-negado")
  }

  return (
    <div suppressHydrationWarning>
      <SidebarProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppSidebar />
          <div className="w-full">
            <SidebarTrigger />
            <header className="flex w-full items-center justify-between px-4">
              <BreadcrumbDashboarding />
              <ModeToggle />
            </header>
            <main className="w-full px-4 pb-6 lg:px-8">{children}</main>
          </div>
        </ThemeProvider>
      </SidebarProvider>
    </div>
  )
}
