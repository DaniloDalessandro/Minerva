"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Employee, CreateEmployeeData } from "@/lib/api/employees"
import { fetchDirections } from "@/lib/api/directions"
import { fetchManagements } from "@/lib/api/managements" 
import { fetchCoordinations } from "@/lib/api/coordinations"
import { Plus, Building2, Layers, SquareTerminal } from "lucide-react"

interface Direction {
  id: number
  name: string
}

interface Management {
  id: number
  name: string
  direction: number
}

interface Coordination {
  id: number
  name: string
  management: number
}

interface EmployeeFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateEmployeeData) => void
  employee?: Employee
  isLoading?: boolean
}

export function EmployeeForm({
  isOpen,
  onClose,
  onSubmit,
  employee,
  isLoading = false
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<CreateEmployeeData>({
    full_name: "",
    email: "",
    cpf: "",
    status: "ATIVO"
  })

  const [directions, setDirections] = useState<Direction[]>([])
  const [managements, setManagements] = useState<Management[]>([])
  const [coordinations, setCoordinations] = useState<Coordination[]>([])
  const [filteredManagements, setFilteredManagements] = useState<Management[]>([])
  const [filteredCoordinations, setFilteredCoordinations] = useState<Coordination[]>([])

  useEffect(() => {
    if (employee) {
      setFormData({
        full_name: employee.full_name,
        email: employee.email,
        cpf: employee.cpf,
        status: employee.status,
        direction: employee.direction,
        management: employee.management,
        coordination: employee.coordination
      })
    }
  }, [employee])

  useEffect(() => {
    if (isOpen) {
      loadSelectData()
    }
  }, [isOpen])

  const loadSelectData = async () => {
    try {
      const [directionsRes, managementsRes, coordinationsRes] = await Promise.all([
        fetchDirections(),
        fetchManagements(1, 100),
        fetchCoordinations(1, 100)
      ])
      
      setDirections(directionsRes.results || directionsRes)
      setManagements(managementsRes.results || managementsRes)
      setCoordinations(coordinationsRes.results || coordinationsRes)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const handleDirectionChange = (value: string) => {
    const directionId = parseInt(value)
    setFormData(prev => ({ 
      ...prev, 
      direction: directionId, 
      management: undefined, 
      coordination: undefined 
    }))
    
    const filtered = managements.filter(m => m.direction === directionId)
    setFilteredManagements(filtered)
    setFilteredCoordinations([])
  }

  const handleManagementChange = (value: string) => {
    const managementId = parseInt(value)
    setFormData(prev => ({ ...prev, management: managementId, coordination: undefined }))
    
    const filtered = coordinations.filter(c => c.management === managementId)
    setFilteredCoordinations(filtered)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      full_name: "",
      email: "",
      cpf: "",
      status: "ATIVO"
    })
    setFilteredManagements([])
    setFilteredCoordinations([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            {employee ? "Editar Funcionário" : "Novo Funcionário"}
          </DialogTitle>
          <p className="text-muted-foreground">
            {employee ? "Atualize as informações do funcionário" : "Preencha os dados para cadastrar um novo funcionário"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                  Nome Completo *
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mail *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="exemplo@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
                  CPF *
                </Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="000.000.000-00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status *
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "ATIVO" | "INATIVO") => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATIVO">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Ativo
                      </div>
                    </SelectItem>
                    <SelectItem value="INATIVO">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Inativo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Estrutura Organizacional */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Estrutura Organizacional</h3>
            
            <div className="space-y-2">
              <Label htmlFor="direction" className="text-sm font-medium text-gray-700">
                Direção
              </Label>
              <Select 
                value={formData.direction?.toString() || ""} 
                onValueChange={handleDirectionChange}
              >
                <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Selecione uma direção" />
                </SelectTrigger>
                <SelectContent>
                  {directions.map((direction) => (
                    <SelectItem key={direction.id} value={direction.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        {direction.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.direction && (
              <div className="space-y-2">
                <Label htmlFor="management" className="text-sm font-medium text-gray-700">
                  Gerência
                </Label>
                <Select 
                  value={formData.management?.toString() || ""} 
                  onValueChange={handleManagementChange}
                >
                  <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione uma gerência" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredManagements.map((management) => (
                      <SelectItem key={management.id} value={management.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-green-600" />
                          {management.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.management && (
              <div className="space-y-2">
                <Label htmlFor="coordination" className="text-sm font-medium text-gray-700">
                  Coordenação
                </Label>
                <Select 
                  value={formData.coordination?.toString() || ""} 
                  onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, coordination: parseInt(value) }))
                  }
                >
                  <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione uma coordenação" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCoordinations.map((coordination) => (
                      <SelectItem key={coordination.id} value={coordination.id.toString()}>
                        <div className="flex items-center gap-2">
                          <SquareTerminal className="h-4 w-4 text-purple-600" />
                          {coordination.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="w-full sm:w-auto h-11 border-gray-200 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-70 disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {employee ? <Plus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {employee ? "Atualizar" : "Criar Funcionário"}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}