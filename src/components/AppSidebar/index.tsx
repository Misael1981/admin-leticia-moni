"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Image from "next/image"
import LogoutButton from "../LogoutButton"

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="bg-blue flex h-40 w-full items-center justify-center rounded-md">
          <Image src="/logo.svg" alt="Logo" width={160} height={160} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
