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
import { useDataRefresh } from "@/contexts/DataRefreshContext"
import { toast } from "@/hooks/use-toast"

// Import API functions
import { createColaborador } from "@/lib/api/colaboradores"
import { createAuxilio } from "@/lib/api/auxilios"
import { createContract } from "@/lib/api/contratos"
import { createBudgetLine } from "@/lib/api/budgetlines"
import { createBudget } from "@/lib/api/budgets"
import { createDirection } from "@/lib/api/directions"
import { createManagement } from "@/lib/api/managements"
import { createCoordination } from "@/lib/api/coordinations"
import { createManagementCenter, createRequestingCenter } from "@/lib/api/centers"
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
  const { triggerRefresh } = useDataRefresh()
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
            name: (user.name || user.email.split("@")[0]).replace(/^Employee\s+/i, ""),
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
          onSubmit={async (data) => {
            try {
              await createColaborador(data)
              toast({
                title: "Sucesso",
                description: "Colaborador criado com sucesso!",
              })
              closeFormDialog('colaborador')
              // Refresh the current page data
              triggerRefresh('colaboradores')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar colaborador",
                variant: "destructive",
              })
            }
          }}
        />
      )}

      {dialogState.auxilio && (
        <AuxilioForm 
          open={dialogState.auxilio}
          handleClose={() => closeFormDialog('auxilio')}
          initialData={null}
          onSubmit={async (data) => {
            try {
              await createAuxilio(data)
              toast({
                title: "Sucesso",
                description: "Auxílio criado com sucesso!",
              })
              closeFormDialog('auxilio')
              triggerRefresh('auxilios')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar auxílio",
                variant: "destructive",
              })
            }
          }}
        />
      )}

      {dialogState.contrato && (
        <ContractForm 
          open={dialogState.contrato}
          handleClose={() => closeFormDialog('contrato')}
          initialData={null}
          onSubmit={async (data) => {
            try {
              await createContract(data)
              toast({
                title: "Sucesso",
                description: "Contrato criado com sucesso!",
              })
              closeFormDialog('contrato')
              triggerRefresh('contratos')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar contrato",
                variant: "destructive",
              })
            }
          }}
        />
      )}

      {dialogState.linhaOrcamentaria && (
        <BudgetLineForm 
          open={dialogState.linhaOrcamentaria}
          handleClose={() => closeFormDialog('linhaOrcamentaria')}
          initialData={null}
          onSubmit={async (data) => {
            try {
              await createBudgetLine(data)
              toast({
                title: "Sucesso",
                description: "Linha Orçamentária criada com sucesso!",
              })
              closeFormDialog('linhaOrcamentaria')
              triggerRefresh('linhas-orcamentarias')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar linha orçamentária",
                variant: "destructive",
              })
            }
          }}
        />
      )}

      {dialogState.orcamento && (
        <BudgetForm 
          open={dialogState.orcamento}
          handleClose={() => closeFormDialog('orcamento')}
          initialData={null}
          onSubmit={async (data) => {
            try {
              await createBudget(data)
              toast({
                title: "Sucesso",
                description: "Orçamento criado com sucesso!",
              })
              closeFormDialog('orcamento')
              triggerRefresh('orcamentos')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar orçamento",
                variant: "destructive",
              })
            }
          }}
        />
      )}


      {dialogState.centro && (
        <ManagementCenterForm 
          open={dialogState.centro}
          handleClose={() => closeFormDialog('centro')}
          initialData={null}
          onSubmit={async (data) => {
            try {
              await createManagementCenter(data)
              toast({
                title: "Sucesso",
                description: "Centro Gestor criado com sucesso!",
              })
              closeFormDialog('centro')
              triggerRefresh('centros')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar centro gestor",
                variant: "destructive",
              })
            }
          }}
        />
      )}

      {dialogState.centroSolicitante && (
        <RequestingCenterForm 
          open={dialogState.centroSolicitante}
          handleClose={() => closeFormDialog('centroSolicitante')}
          initialData={null}
          onSubmit={async (data) => {
            try {
              await createRequestingCenter(data)
              toast({
                title: "Sucesso",
                description: "Centro Solicitante criado com sucesso!",
              })
              closeFormDialog('centroSolicitante')
              triggerRefresh('centros')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar centro solicitante",
                variant: "destructive",
              })
            }
          }}
        />
      )}

      {dialogState.direcao && (
        <DirectionForm 
          open={dialogState.direcao}
          handleClose={() => closeFormDialog('direcao')}
          initialData={null}
          onSubmit={async (data) => {
            try {
              await createDirection({ name: data.name })
              toast({
                title: "Sucesso",
                description: "Direção criada com sucesso!",
              })
              closeFormDialog('direcao')
              triggerRefresh('setores')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar direção",
                variant: "destructive",
              })
            }
          }}
        />
      )}

      {dialogState.gerencia && (
        <ManagementForm 
          open={dialogState.gerencia}
          handleClose={() => closeFormDialog('gerencia')}
          initialData={null}
          onSubmit={async (data) => {
            try {
              await createManagement({ name: data.name })
              toast({
                title: "Sucesso",
                description: "Gerência criada com sucesso!",
              })
              closeFormDialog('gerencia')
              triggerRefresh('setores')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar gerência",
                variant: "destructive",
              })
            }
          }}
        />
      )}

      {dialogState.coordenacao && (
        <CoordinationForm 
          open={dialogState.coordenacao}
          handleClose={() => closeFormDialog('coordenacao')}
          initialData={null}
          onSubmit={async (data) => {
            try {
              await createCoordination({ name: data.name })
              toast({
                title: "Sucesso",
                description: "Coordenação criada com sucesso!",
              })
              closeFormDialog('coordenacao')
              triggerRefresh('setores')
            } catch (error: any) {
              toast({
                title: "Erro",
                description: error.message || "Erro ao criar coordenação",
                variant: "destructive",
              })
            }
          }}
        />
      )}
    </Sidebar>
  )
}
