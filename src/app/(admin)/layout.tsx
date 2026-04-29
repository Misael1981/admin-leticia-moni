import AppSidebar from "@/components/AppSidebar"
import BreadcrumbDashboarding from "@/components/BreadcrumbDashboarding"
import ModeToggle from "@/components/ModeToggle"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
            {children}
          </div>
        </ThemeProvider>
      </SidebarProvider>
    </div>
  )
}
