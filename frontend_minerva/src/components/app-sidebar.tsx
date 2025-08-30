"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
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
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()

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
        { title: "Adicionar", url: "/colaboradores" },
      ],
    },
    {
      title: "Auxílios",
      url: "/auxilios",
      icon: HandCoins,
      items: [
        { title: "Buscar", url: "/auxilios" },
        { title: "Buscar Todos", url: "/auxilios" },
        { title: "Adicionar", url: "/auxilios" },
      ],
    },
    {
      title: "Contratos",
      url: "/contratos",
      icon: FileText,
      items: [
        { title: "Buscar", url: "/contratos" },
        { title: "Adicionar", url: "/contratos" },
      ],
    },
    {
      title: "Linhas Orçamentárias",
      url: "/linhas-orcamentarias",
      icon: Landmark,
      items: [
        { title: "Buscar", url: "/linhas-orcamentarias" },
        { title: "Adicionar", url: "/linhas-orcamentarias" },
      ],
    },
    {
      title: "Orçamentos",
      url: "/orcamento",
      icon: Wallet,
      items: [
        { title: "Buscar", url: "/orcamento" },
        { title: "Adicionar", url: "/orcamento" },
      ],
    },
    {
      title: "Setores",
      url: "/setor",
      icon: Building2,
      items: [
        { title: "Buscar", url: "/setor" },
        { title: "Adicionar", url: "/setor" },
      ],
    },
    {
      title: "Centros",
      url: "/centro",
      icon: Layers,
      items: [
        { title: "Buscar", url: "/centro" },
        { title: "Adicionar", url: "/centro" },
      ],
    },
    {
      title: "Fale com Alice",
      url: "/alice",
      icon: Bot,
    },
  ]

  if (!user) return null

  const isAlicePage = pathname.startsWith("/alice")

  if (isAlicePage) {
    // Sidebar fixa, sem opção de expandir
    return (
      <aside className="w-64 bg-white border-r flex flex-col" {...props}>
        <div className="p-4 border-b">
          <TeamSwitcher teams={teams} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavMain items={navItems} />
        </div>
        <div className="p-4 border-t">
          <NavUser
            user={{
              name: user.name || user.email.split("@")[0],
              email: user.email,
              avatar: user.avatar || "/avatars/default.svg",
            }}
          />
        </div>
      </aside>
    )
  }

  // Sidebar normal (com expandir/recolher)
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
            name: user.name || user.email.split("@")[0],
            email: user.email,
            avatar: user.avatar || "/avatars/default.svg",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
