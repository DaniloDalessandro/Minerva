"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Search } from "lucide-react"
import { 
  Contract,
  ContractInstallment,
  ContractAmendment,
  getContracts,
  getContractInstallments,
  getContractAmendments,
  createContract,
  createContractInstallment,
  createContractAmendment,
  updateContract,
  updateContractInstallment,
  updateContractAmendment,
  deleteContract,
  deleteContractInstallment,
  deleteContractAmendment,
  CreateContractData,
  CreateContractInstallmentData,
  CreateContractAmendmentData
} from "@/lib/api/contracts"
import { getBudgetLines, BudgetLine } from "@/lib/api/budgetlines"
import { getEmployees, Employee } from "@/lib/api/employees"
import { contractColumns, contractInstallmentColumns, contractAmendmentColumns } from "./columns"
import { ContractForm } from "@/components/forms/ContractForm"
import { ContractInstallmentForm } from "@/components/forms/ContractInstallmentForm"
import { ContractAmendmentForm } from "@/components/forms/ContractAmendmentForm"
import { useDebounce } from "@/hooks/useDebounce"

type FormType = 'contract' | 'installment' | 'amendment' | null

export default function ContratoPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [installments, setInstallments] = useState<ContractInstallment[]>([])
  const [amendments, setAmendments] = useState<ContractAmendment[]>([])
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formType, setFormType] = useState<FormType>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [selectedInstallment, setSelectedInstallment] = useState<ContractInstallment | null>(null)
  const [selectedAmendment, setSelectedAmendment] = useState<ContractAmendment | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("contracts")
  
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [contractsRes, installmentsRes, amendmentsRes, budgetLinesRes, employeesRes] = await Promise.all([
        getContracts(),
        getContractInstallments(),
        getContractAmendments(),
        getBudgetLines(),
        getEmployees()
      ])
      
      setContracts(contractsRes.results || contractsRes)
      setInstallments(installmentsRes.results || installmentsRes)
      setAmendments(amendmentsRes.results || amendmentsRes)
      setBudgetLines(budgetLinesRes.results || budgetLinesRes)
      setEmployees(employeesRes.results || employeesRes)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Contract handlers
  const handleEditContract = (contract: Contract) => {
    setSelectedContract(contract)
    setFormType('contract')
    setIsFormOpen(true)
  }

  const handleDeleteContract = (contract: Contract) => {
    setSelectedContract(contract)
    setFormType('contract')
    setIsDeleteDialogOpen(true)
  }

  const handleContractSubmit = async (data: CreateContractData) => {
    try {
      setIsSubmitting(true)
      if (selectedContract) {
        await updateContract(selectedContract.id, data)
      } else {
        await createContract(data)
      }
      await loadData()
      handleCloseForm()
    } catch (error) {
      console.error("Erro ao salvar contrato:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Similar handlers for installments and amendments...
  const handleConfirmDelete = async () => {
    try {
      if (formType === 'contract' && selectedContract) {
        await deleteContract(selectedContract.id)
      } else if (formType === 'installment' && selectedInstallment) {
        await deleteContractInstallment(selectedInstallment.id)
      } else if (formType === 'amendment' && selectedAmendment) {
        await deleteContractAmendment(selectedAmendment.id)
      }
      await loadData()
      setIsDeleteDialogOpen(false)
      setSelectedContract(null)
      setSelectedInstallment(null)
      setSelectedAmendment(null)
      setFormType(null)
    } catch (error) {
      console.error("Erro ao excluir:", error)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedContract(null)
    setSelectedInstallment(null)
    setSelectedAmendment(null)
    setFormType(null)
  }

  const handleNewContract = () => {
    setFormType('contract')
    setIsFormOpen(true)
  }

  // Filter data based on search
  const filteredContracts = contracts.filter(contract => 
    contract.protocol_number.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    contract.description.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const contractColumnsWithActions = contractColumns(handleEditContract, handleDeleteContract, budgetLines, employees)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contratos</h1>
          <p className="text-muted-foreground">
            Gerencie contratos, parcelas e aditivos
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="contracts">Contratos</TabsTrigger>
            <TabsTrigger value="installments">Parcelas</TabsTrigger>
            <TabsTrigger value="amendments">Aditivos</TabsTrigger>
          </TabsList>
          
          <Button onClick={handleNewContract}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <TabsContent value="contracts">
          <DataTable
            columns={contractColumnsWithActions}
            data={filteredContracts}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="installments">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
          </div>
        </TabsContent>

        <TabsContent value="amendments">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Funcionalidade em desenvolvimento</p>
          </div>
        </TabsContent>
      </Tabs>

      {formType === 'contract' && (
        <ContractForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleContractSubmit}
          contract={selectedContract || undefined}
          budgetLines={budgetLines}
          employees={employees}
          isLoading={isSubmitting}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este{" "}
              {formType === 'contract' ? 'contrato' : 
               formType === 'installment' ? 'parcela' : 'aditivo'}? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}