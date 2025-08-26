"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
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
  BudgetLine, 
  getBudgetLines, 
  createBudgetLine, 
  updateBudgetLine, 
  deleteBudgetLine, 
  CreateBudgetLineData 
} from "@/lib/api/budgetlines"
import { getBudgets, Budget } from "@/lib/api/budgets"
import { getManagementCenters, getRequestingCenters, ManagementCenter, RequestingCenter } from "@/lib/api/centers"
import { getEmployees, Employee } from "@/lib/api/employees"
import { budgetLineColumns } from "./columns"
import { BudgetLineForm } from "@/components/forms/BudgetLineForm"
import { useDebounce } from "@/hooks/useDebounce"

export default function LinhaOrcamentariaPage() {
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [managementCenters, setManagementCenters] = useState<ManagementCenter[]>([])
  const [requestingCenters, setRequestingCenters] = useState<RequestingCenter[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBudgetLine, setSelectedBudgetLine] = useState<BudgetLine | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const debouncedSearch = useDebounce(searchTerm, 300)
  const [filteredBudgetLines, setFilteredBudgetLines] = useState<BudgetLine[]>([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (debouncedSearch) {
      const filtered = budgetLines.filter(budgetLine => {
        const budget = budgets.find(b => b.id === budgetLine.budget)
        const managementCenter = managementCenters.find(mc => mc.id === budgetLine.management_center)
        const requestingCenter = requestingCenters.find(rc => rc.id === budgetLine.requesting_center)
        
        return (
          budgetLine.summary_description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          budgetLine.object?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          budgetLine.expense_type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          budget?.category.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          managementCenter?.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          requestingCenter?.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      })
      setFilteredBudgetLines(filtered)
    } else {
      setFilteredBudgetLines(budgetLines)
    }
  }, [debouncedSearch, budgetLines, budgets, managementCenters, requestingCenters])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [budgetLinesRes, budgetsRes, managementCentersRes, requestingCentersRes, employeesRes] = await Promise.all([
        getBudgetLines(),
        getBudgets(),
        getManagementCenters(),
        getRequestingCenters(),
        getEmployees()
      ])
      
      setBudgetLines(budgetLinesRes.results || budgetLinesRes)
      setBudgets(budgetsRes.results || budgetsRes)
      setManagementCenters(managementCentersRes.results || managementCentersRes)
      setRequestingCenters(requestingCentersRes.results || requestingCentersRes)
      setEmployees(employeesRes.results || employeesRes)
      setFilteredBudgetLines(budgetLinesRes.results || budgetLinesRes)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (budgetLine: BudgetLine) => {
    setSelectedBudgetLine(budgetLine)
    setIsFormOpen(true)
  }

  const handleDelete = (budgetLine: BudgetLine) => {
    setSelectedBudgetLine(budgetLine)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: CreateBudgetLineData) => {
    try {
      setIsSubmitting(true)
      if (selectedBudgetLine) {
        await updateBudgetLine(selectedBudgetLine.id, data)
      } else {
        await createBudgetLine(data)
      }
      await loadData()
      handleCloseForm()
    } catch (error) {
      console.error("Erro ao salvar linha orçamentária:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedBudgetLine) return

    try {
      await deleteBudgetLine(selectedBudgetLine.id)
      await loadData()
      setIsDeleteDialogOpen(false)
      setSelectedBudgetLine(null)
    } catch (error) {
      console.error("Erro ao excluir linha orçamentária:", error)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedBudgetLine(null)
  }

  const columns = budgetLineColumns(handleEdit, handleDelete, budgets, managementCenters, requestingCenters, employees)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Linhas Orçamentárias</h1>
          <p className="text-muted-foreground">
            Gerencie as linhas orçamentárias detalhadas
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Linha Orçamentária
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição, objeto, tipo, centro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredBudgetLines}
        isLoading={isLoading}
      />

      <BudgetLineForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        budgetLine={selectedBudgetLine || undefined}
        budgets={budgets}
        managementCenters={managementCenters}
        requestingCenters={requestingCenters}
        employees={employees}
        isLoading={isSubmitting}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta linha orçamentária "{selectedBudgetLine?.summary_description || 'Sem descrição'}"? 
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