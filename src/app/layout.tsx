import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import AuthProvider from "@/providers/auth"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Admin Moni Fisio",
  applicationName: "Moni Fisio App do Paciente",
  description:
    "Fisioterapia Especializada em Reabilitação de Face, Cabeça e Pescoço.",
  creator: "Letícia Moni Fisioterapia",
  authors: [{ name: "Letícia Moni Fisioterapia" }],
  category: "health",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Moni Paciente",
  },
  icons: {
    icon: [
      { url: "/icons/favicon.ico", type: "image/x-icon" },
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icons/favicon-96x96.png"],
    other: [{ rel: "mask-icon", url: "/logo.svg", color: "#ebe5cc" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#1b3d54",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="pt-BR"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>

          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
