"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import LogoutButton from "../LogoutButton"
import {
  Activity,
  Calendar,
  ChartNoAxesCombined,
  FileUser,
  Hospital,
  LayoutDashboard,
  Stethoscope,
  Store,
  Users,
  VideoIcon,
} from "lucide-react"
import Link from "next/link"
import { RiTeamLine } from "react-icons/ri"

const pages = [
  {
    name: "Visão Geral",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Dashboard Financeiro",
    url: "/dashboard/financeiro",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Gerenciamento de Agenda",
    url: "/dashboard/agenda",
    icon: Calendar,
  },
  {
    name: "Informações Gerais da Clínica",
    url: "/dashboard/info-clinica",
    icon: Hospital,
  },
  {
    name: "Gerenciamento do time de profissionais",
    url: "/dashboard/profissionais",
    icon: RiTeamLine,
  },
  {
    name: "Gerenciamento dos Vídeos de Treinos",
    url: "/dashboard/videos",
    icon: VideoIcon,
  },
  {
    name: "Gerenciamento de Usuários",
    url: "/dashboard/usuarios",
    icon: Users,
  },
  {
    name: "Gerenciamento de Tratamentos Disponíveis",
    url: "/dashboard/tratamentos",
    icon: Activity,
  },
  {
    name: "Gerenciamento de Pacientes",
    url: "/dashboard/pacientes",
    icon: FileUser,
  },
  {
    name: "Gerenciamento da loja",
    url: "/dashboard/loja",
    icon: Store,
  },
  {
    name: "Moderação de Depoimentos",
    url: "/dashboard/depoimentos",
    icon: Stethoscope,
  },
]

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="bg-blue flex h-40 w-full items-center justify-center rounded-md">
          <Image src="/logo.svg" alt="Logo" width={160} height={160} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicações</SidebarGroupLabel>
          <SidebarMenu>
            {pages.map((page) => (
              <SidebarMenuItem key={page.url}>
                <SidebarMenuButton asChild>
                  <Link href={page.url}>
                    <page.icon />
                    <span>{page.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
