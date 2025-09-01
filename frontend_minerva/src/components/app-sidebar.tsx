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
  BarChart3,
  HelpCircle,
  Anchor,
} from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { usePathname } from "next/navigation"

// Import form components
import ColaboradorForm from "@/components/forms/ColaboradorForm"
import AuxilioForm from "@/components/forms/AuxilioForm"
import ContractForm from "@/components/forms/ContractForm"
import BudgetLineForm from "@/components/forms/BudgetLineForm"
import BudgetForm from "@/components/forms/BudgetForm"
import DirectionForm from "@/components/forms/DirectionForm"
import ManagementForm from "@/components/forms/ManagementForm"
import CoordinationForm from "@/components/forms/CoordinationForm"
import ManagementCenterForm from "@/components/forms/ManagementCenterForm"
import RequestingCenterForm from "@/components/forms/RequestingCenterForm"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
  items?: {
    title: string
    url: string
    action?: string
  }[]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext()
  const pathname = usePathname()
  
  // Form dialog states
  const [dialogState, setDialogState] = React.useState({
    colaborador: false,
    auxilio: false,
    contrato: false,
    linhaOrcamentaria: false,
    orcamento: false,
    centro: false,
    centroSolicitante: false,
    direcao: false,
    gerencia: false,
    coordenacao: false,
  })

  // Handler to open specific form dialog
  const openFormDialog = (formType: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [formType]: true }))
  }

  // Handler to close specific form dialog
  const closeFormDialog = (formType: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [formType]: false }))
  }

  const navItems: NavItem[] = [
    {
      title: "Dashboards",
      url: "/dashboard",
      icon: BarChart3,
      items: [
        { title: "Visão Geral", url: "/dashboard" },
        { title: "Contratos", url: "/dashboard/contratos" },
        { title: "Orçamentos", url: "/dashboard/orcamentos" },
        { title: "Auxilios", url: "/dashboard/auxilios" },
      ],
    },
    {
      title: "Colaboradores",
      url: "/colaboradores",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Buscar", url: "/colaboradores" },
        { title: "Adicionar", url: "/colaboradores", action: "colaborador" },
      ],
    },
    {
      title: "Auxílios",
      url: "/auxilios",
      icon: HandCoins,
      items: [
        { title: "Buscar", url: "/auxilios" },
        { title: "Buscar Todos", url: "/auxilios" },
        { title: "Adicionar", url: "/auxilios", action: "auxilio" },
      ],
    },
    {
      title: "Contratos",
      url: "/contratos",
      icon: FileText,
      items: [
        { title: "Buscar", url: "/contratos" },
        { title: "Adicionar", url: "/contratos", action: "contrato" },
      ],
    },
    {
      title: "Linhas Orçamentárias",
      url: "/linhas-orcamentarias",
      icon: Landmark,
      items: [
        { title: "Buscar", url: "/linhas-orcamentarias" },
        { title: "Adicionar", url: "/linhas-orcamentarias", action: "linhaOrcamentaria" },
      ],
    },
    {
      title: "Orçamentos",
      url: "/orcamento",
      icon: Wallet,
      items: [
        { title: "Buscar", url: "/orcamento" },
        { title: "Adicionar", url: "/orcamento", action: "orcamento" },
      ],
    },
    {
      title: "Setores",
      url: "/setor",
      icon: Building2,
      items: [
        { title: "Buscar", url: "/setor" },
        { title: "Adicionar Direção", url: "/setor", action: "direcao" },
        { title: "Adicionar Gerência", url: "/setor", action: "gerencia" },
        { title: "Adicionar Coordenação", url: "/setor", action: "coordenacao" },
      ],
    },
    {
      title: "Centros",
      url: "/centro",
      icon: Layers,
      items: [
        { title: "Buscar", url: "/centro" },
        { title: "Adicionar Centro Gestor", url: "/centro", action: "centro" },
        { title: "Adicionar Centro Solicitante", url: "/centro", action: "centroSolicitante" },
      ],
    },
    {
      title: "Fale com Alice",
      url: "/alice",
      icon: Bot,
    },
    {
      title: "Ajuda",
      url: "/ajuda",
      icon: HelpCircle,
    },
  ]

  if (!user) return null

  const isAlicePage = pathname.startsWith("/alice")

  if (isAlicePage) {
    // Sidebar fixa, sem opção de expandir
    return (
      <aside className="w-64 bg-white border-r flex flex-col" {...props}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-blue-700 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
              <Anchor className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Minerva</span>
              <span className="truncate text-xs">Gestão de Contratos</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavMain items={navItems} onFormAction={openFormDialog} />
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
        
        {/* Form Dialogs */}
        {dialogState.colaborador && (
          <ColaboradorForm 
            open={dialogState.colaborador}
            handleClose={() => closeFormDialog('colaborador')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Colaborador criado:', data)
              closeFormDialog('colaborador')
            }}
          />
        )}

        {dialogState.auxilio && (
          <AuxilioForm 
            open={dialogState.auxilio}
            handleClose={() => closeFormDialog('auxilio')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Auxílio criado:', data)
              closeFormDialog('auxilio')
            }}
          />
        )}

        {dialogState.contrato && (
          <ContractForm 
            open={dialogState.contrato}
            handleClose={() => closeFormDialog('contrato')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Contrato criado:', data)
              closeFormDialog('contrato')
            }}
          />
        )}

        {dialogState.linhaOrcamentaria && (
          <BudgetLineForm 
            open={dialogState.linhaOrcamentaria}
            handleClose={() => closeFormDialog('linhaOrcamentaria')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Linha Orçamentária criada:', data)
              closeFormDialog('linhaOrcamentaria')
            }}
          />
        )}

        {dialogState.orcamento && (
          <BudgetForm 
            open={dialogState.orcamento}
            handleClose={() => closeFormDialog('orcamento')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Orçamento criado:', data)
              closeFormDialog('orcamento')
            }}
          />
        )}


        {dialogState.centro && (
          <ManagementCenterForm 
            open={dialogState.centro}
            handleClose={() => closeFormDialog('centro')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Centro Gestor criado:', data)
              closeFormDialog('centro')
            }}
          />
        )}

        {dialogState.centroSolicitante && (
          <RequestingCenterForm 
            open={dialogState.centroSolicitante}
            handleClose={() => closeFormDialog('centroSolicitante')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Centro Solicitante criado:', data)
              closeFormDialog('centroSolicitante')
            }}
          />
        )}

        {dialogState.direcao && (
          <DirectionForm 
            open={dialogState.direcao}
            handleClose={() => closeFormDialog('direcao')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Direção criada:', data)
              closeFormDialog('direcao')
            }}
          />
        )}

        {dialogState.gerencia && (
          <ManagementForm 
            open={dialogState.gerencia}
            handleClose={() => closeFormDialog('gerencia')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Gerência criada:', data)
              closeFormDialog('gerencia')
            }}
          />
        )}

        {dialogState.coordenacao && (
          <CoordinationForm 
            open={dialogState.coordenacao}
            handleClose={() => closeFormDialog('coordenacao')}
            initialData={null}
            onSubmit={(data) => {
              console.log('Coordenação criada:', data)
              closeFormDialog('coordenacao')
            }}
          />
        )}
      </aside>
    )
  }

  // Sidebar normal (com expandir/recolher)
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-14 items-center px-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-700 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
              <Anchor className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Minerva</span>
              <span className="truncate text-xs">Gestão de Contratos</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} onFormAction={openFormDialog} />
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
      
      {/* Form Dialogs */}
      {dialogState.colaborador && (
        <ColaboradorForm 
          open={dialogState.colaborador}
          handleClose={() => closeFormDialog('colaborador')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Colaborador criado:', data)
            closeFormDialog('colaborador')
          }}
        />
      )}

      {dialogState.auxilio && (
        <AuxilioForm 
          open={dialogState.auxilio}
          handleClose={() => closeFormDialog('auxilio')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Auxílio criado:', data)
            closeFormDialog('auxilio')
          }}
        />
      )}

      {dialogState.contrato && (
        <ContractForm 
          open={dialogState.contrato}
          handleClose={() => closeFormDialog('contrato')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Contrato criado:', data)
            closeFormDialog('contrato')
          }}
        />
      )}

      {dialogState.linhaOrcamentaria && (
        <BudgetLineForm 
          open={dialogState.linhaOrcamentaria}
          handleClose={() => closeFormDialog('linhaOrcamentaria')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Linha Orçamentária criada:', data)
            closeFormDialog('linhaOrcamentaria')
          }}
        />
      )}

      {dialogState.orcamento && (
        <BudgetForm 
          open={dialogState.orcamento}
          handleClose={() => closeFormDialog('orcamento')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Orçamento criado:', data)
            closeFormDialog('orcamento')
          }}
        />
      )}


      {dialogState.centro && (
        <ManagementCenterForm 
          open={dialogState.centro}
          handleClose={() => closeFormDialog('centro')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Centro Gestor criado:', data)
            closeFormDialog('centro')
          }}
        />
      )}

      {dialogState.centroSolicitante && (
        <RequestingCenterForm 
          open={dialogState.centroSolicitante}
          handleClose={() => closeFormDialog('centroSolicitante')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Centro Solicitante criado:', data)
            closeFormDialog('centroSolicitante')
          }}
        />
      )}

      {dialogState.direcao && (
        <DirectionForm 
          open={dialogState.direcao}
          handleClose={() => closeFormDialog('direcao')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Direção criada:', data)
            closeFormDialog('direcao')
          }}
        />
      )}

      {dialogState.gerencia && (
        <ManagementForm 
          open={dialogState.gerencia}
          handleClose={() => closeFormDialog('gerencia')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Gerência criada:', data)
            closeFormDialog('gerencia')
          }}
        />
      )}

      {dialogState.coordenacao && (
        <CoordinationForm 
          open={dialogState.coordenacao}
          handleClose={() => closeFormDialog('coordenacao')}
          initialData={null}
          onSubmit={(data) => {
            console.log('Coordenação criada:', data)
            closeFormDialog('coordenacao')
          }}
        />
      )}
    </Sidebar>
  )
}
