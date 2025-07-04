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
    url: "#",
    icon: HandCoins,
    items: [
      { title: "Buscar", url: "#" },
      { title: "Adicionar", url: "#" },
    ],
  },
  {
    title: "Contratos",
    url: "#",
    icon: FileText,
    items: [
      { title: "Buscar", url: "#" },
      { title: "Adicionar", url: "#" },
    ],
  },
  {
    title: "Linhas Orçamentárias",
    url: "#",
    icon: Landmark,
    items: [
      { title: "Buscar", url: "#" },
      { title: "Adicionar", url: "#" },
    ],
  },
  {
    title: "Orçamentos",
    url: "#",
    icon: Wallet,
    items: [
      { title: "Buscar", url: "#" },
      { title: "Adicionar", url: "#" },
    ],
  },
  {
    title: "Setores",
    url: "#",
    icon: Building2,
    items: [
      { title: "Buscar", url: "setor/" },
      { title: "Adicionar Direção", url: "#" },
      { title: "Adicionar Gerencia", url: "#" },
      { title: "Adicionar Coordenação", url: "#" },
    ],
  },
  {
    title: "Centros",
    url: "#",
    icon: Layers,
    items: [
      { title: "Buscar", url: "#" },
      { title: "Adicionar", url: "#" },
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