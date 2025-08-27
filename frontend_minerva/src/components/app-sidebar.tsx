"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
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

interface Team {
  name: string
  logo: React.ComponentType<{ className?: string }>
  plan: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext()

  // Dados das equipes - pode vir da API no futuro
  const teams: Team[] = [
    {
      name: "Minerva",
      logo: GalleryVerticalEnd,
      plan: "Gestão de contratos",
    },
    
  ]

 
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
    url: "/aids",
    icon: HandCoins,
    items: [
      { title: "Buscar", url: "/aids" },
      { title: "Adicionar", url: "/aids/new" },
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
    url: "/budgetlines",
    icon: Landmark,
    items: [
      { title: "Buscar", url: "/budgetlines" },
      { title: "Adicionar", url: "/budgetlines/new" },
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
    url: "/sectors",
    icon: Building2,
    items: [
      { title: "Buscar", url: "/sectors" },
      { title: "Adicionar Direção", url: "/sectors/direction/new" },
      { title: "Adicionar Gerencia", url: "/sectors/management/new" },
      { title: "Adicionar Coordenação", url: "/sectors/coordination/new" },
    ],
  },
  {
    title: "Centros",
    url: "/centers",
    icon: Layers,
    items: [
      { title: "Buscar", url: "/centers" },
      { title: "Adicionar", url: "/centers/new" },
    ],
  },
    
  ]

  if (!user) {
    return null 
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
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