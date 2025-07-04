"use client"

import * as React from "react"
import {
  SquareTerminal,
  HandCoins,
  FileText,
  Landmark,
  Wallet,
  Building2,
  Layers,
} from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext()

  // Dados de navegação - pode ser movido para um arquivo de configuração
  const navItems: NavItem[] = [
    {
      title: "Colaboradores",
      url: "/employees",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Buscar", url: "/employees" },
        { title: "Adicionar", url: "/employees/new" },
      ],
    },
    {
      title: "Auxílios",
      url: "/benefits",
      icon: HandCoins,
      items: [
        { title: "Buscar", url: "/benefits" },
        { title: "Adicionar", url: "/benefits/new" },
      ],
    },
    {
      title: "Contratos",
      url: "/contracts",
      icon: FileText,
      items: [
        { title: "Buscar", url: "/contracts" },
        { title: "Adicionar", url: "/contracts/new" },
      ],
    },
    {
      title: "Linhas Orçamentárias",
      url: "/budget-lines",
      icon: Landmark,
      items: [
        { title: "Buscar", url: "/budget-lines" },
        { title: "Adicionar", url: "/budget-lines/new" },
      ],
    },
    {
      title: "Orçamentos",
      url: "/budgets",
      icon: Wallet,
      items: [
        { title: "Buscar", url: "/budgets" },
        { title: "Adicionar", url: "/budgets/new" },
      ],
    },
    {
      title: "Setores",
      url: "/departments",
      icon: Building2,
      items: [
        { title: "Buscar", url: "/departments" },
        { title: "Adicionar Direção", url: "/departments/new/direction" },
        { title: "Adicionar Gerência", url: "/departments/new/management" },
        { title: "Adicionar Coordenação", url: "/departments/new/coordination" },
      ],
    },
    {
      title: "Centros",
      url: "/cost-centers",
      icon: Layers,
      items: [
        { title: "Buscar", url: "/cost-centers" },
        { title: "Adicionar", url: "/cost-centers/new" },
      ],
    },
  ]

  if (!user) {
    return null // Ou um loading state
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={[]} />
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser 
          user={{
            name: user.name || user.email.split('@')[0],
            email: user.email,
            avatar: user.avatar || "/avatars/default.jpg"
          }} 
        />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}