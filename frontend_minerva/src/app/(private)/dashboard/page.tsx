"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnchorEmoji } from "@/components/ui/anchor-icon"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("dashboard/")
    }
  }, [router])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header do Dashboard */}
      <div className="flex items-center gap-3 mb-6">
        <AnchorEmoji className="text-3xl" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Minerva</h1>
          <p className="text-sm text-gray-600">Sistema de Gestão de Contratos - Visão Geral</p>
        </div>
      </div>
      
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <AnchorEmoji className="text-4xl mb-2" />
            <p className="text-sm font-medium">Contratos</p>
          </div>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <AnchorEmoji className="text-4xl mb-2" />
            <p className="text-sm font-medium">Colaboradores</p>
          </div>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
          <div className="text-center">
            <AnchorEmoji className="text-4xl mb-2" />
            <p className="text-sm font-medium">Orçamentos</p>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min flex items-center justify-center">
        <div className="text-center">
          <AnchorEmoji className="text-6xl mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Bem-vindo ao Minerva</h2>
          <p className="text-gray-500">Sistema de Gestão de Contratos em funcionamento</p>
        </div>
      </div>
    </div>
  )
}
