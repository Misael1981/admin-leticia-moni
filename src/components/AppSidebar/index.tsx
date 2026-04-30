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
import { Hospital, Users } from "lucide-react"
import { Activity } from "react"
import Link from "next/link"

const pages = [
  {
    name: "Visão Geral",
    url: "/dashboard",
    icon: Hospital,
  },
  {
    name: "Informações Gerais da Clínica",
    url: "/dashboard/info-clinica",
    icon: Hospital,
  },
  {
    name: "Gerenciamento deUsuários",
    url: "/dashboard/usuarios",
    icon: Users,
  },
  {
    name: "Gerenciamento de Tratamentos Disponíveis",
    url: "/dashboard/tratamentos",
    icon: Activity,
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
