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
  Bot,
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
      url: "/colaboradores",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Buscar", url: "/colaboradores" },
        { title: "Adicionar", url: "/colaboradores/new" },
      ],
    },
    {
    title: "Auxílios",
    url: "/auxilio",
    icon: HandCoins,
    items: [
      { title: "Buscar", url: "/auxilio" },
      { title: "Buscar Todos", url: "/auxilios" },
      { title: "Adicionar", url: "/auxilio/new" },
    ],
  },
  {
    title: "Contratos",
    url: "/contratos",
    icon: FileText,
    items: [
      { title: "Buscar", url: "/contratos" },
      { title: "Adicionar", url: "/contratos/new" },
    ],
  },
  {
    title: "Linhas Orçamentárias",
    url: "/linhas-orcamentarias",
    icon: Landmark,
    items: [
      { title: "Buscar", url: "/linhas-orcamentarias" },
      { title: "Adicionar", url: "/linhas-orcamentarias/new" },
    ],
  },
  {
    title: "Orçamentos",
    url: "/orcamento",
    icon: Wallet,
    items: [
      { title: "Buscar", url: "/orcamento" },
      { title: "Adicionar", url: "/orcamento/new" },
    ],
  },
  {
    title: "Setores",
    url: "/setor",
    icon: Building2,
    items: [
      { title: "Buscar", url: "/setor" },
      { title: "Adicionar Direção", url: "/setor/direction/new" },
      { title: "Adicionar Gerencia", url: "/setor/management/new" },
      { title: "Adicionar Coordenação", url: "/setor/coordination/new" },
    ],
  },
  {
    title: "Centros",
    url: "/centro",
    icon: Layers,
    items: [
      { title: "Buscar", url: "/centro" },
      { title: "Adicionar", url: "/centro/new" },
    ],
  },
  {
    title: "Fale com Alice",
    url: "/alice",
    icon: Bot,
    items: [
      { title: "Chat", url: "/alice" },
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