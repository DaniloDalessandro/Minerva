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
  Settings2,
} from "lucide-react"

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

const data = {
  user: {
    name: "Danilo Costa",
    email: "danilo@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Minerva",
      logo: GalleryVerticalEnd,
      plan: "Gestão de contratos",
    },
    {
      name: "Minerva",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Colaboradores",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Buscar", url: "#" },
        { title: "Adicionar", url: "#" },
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
