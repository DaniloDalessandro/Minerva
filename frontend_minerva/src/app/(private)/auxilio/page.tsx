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
  Assistance, 
  getAssistances, 
  createAssistance, 
  updateAssistance, 
  deleteAssistance, 
  CreateAssistanceData 
} from "@/lib/api/aids"
import { getEmployees, Employee } from "@/lib/api/employees"
import { getBudgetLines, BudgetLine } from "@/lib/api/budgetlines"
import { assistanceColumns } from "./columns"
import { AssistanceForm } from "@/components/forms/AssistanceForm"
import { useDebounce } from "@/hooks/useDebounce"

export default function AuxilioPage() {
  const [assistances, setAssistances] = useState<Assistance[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAssistance, setSelectedAssistance] = useState<Assistance | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const debouncedSearch = useDebounce(searchTerm, 300)
  const [filteredAssistances, setFilteredAssistances] = useState<Assistance[]>([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (debouncedSearch) {
      const filtered = assistances.filter(assistance => {
        const employee = employees.find(emp => emp.id === assistance.employee)
        const budgetLine = budgetLines.find(bl => bl.id === assistance.budget_line)
        
        return (
          employee?.full_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          budgetLine?.summary_description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          assistance.type?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          assistance.status.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      })
      setFilteredAssistances(filtered)
    } else {
      setFilteredAssistances(assistances)
    }
  }, [debouncedSearch, assistances, employees, budgetLines])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [assistancesRes, employeesRes, budgetLinesRes] = await Promise.all([
        getAssistances(),
        getEmployees(),
        getBudgetLines()
      ])
      
      setAssistances(assistancesRes.results || assistancesRes)
      setEmployees(employeesRes.results || employeesRes)
      setBudgetLines(budgetLinesRes.results || budgetLinesRes)
      setFilteredAssistances(assistancesRes.results || assistancesRes)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (assistance: Assistance) => {
    setSelectedAssistance(assistance)
    setIsFormOpen(true)
  }

  const handleDelete = (assistance: Assistance) => {
    setSelectedAssistance(assistance)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = async (data: CreateAssistanceData) => {
    try {
      setIsSubmitting(true)
      if (selectedAssistance) {
        await updateAssistance(selectedAssistance.id, data)
      } else {
        await createAssistance(data)
      }
      await loadData()
      handleCloseForm()
    } catch (error) {
      console.error("Erro ao salvar auxílio:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedAssistance) return

    try {
      await deleteAssistance(selectedAssistance.id)
      await loadData()
      setIsDeleteDialogOpen(false)
      setSelectedAssistance(null)
    } catch (error) {
      console.error("Erro ao excluir auxílio:", error)
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedAssistance(null)
  }

  const columns = assistanceColumns(handleEdit, handleDelete, employees, budgetLines)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Auxílios</h1>
          <p className="text-muted-foreground">
            Gerencie os auxílios educacionais dos funcionários
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Auxílio
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por funcionário, linha orçamentária, tipo ou status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredAssistances}
        isLoading={isLoading}
      />

      <AssistanceForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        assistance={selectedAssistance || undefined}
        employees={employees}
        budgetLines={budgetLines}
        isLoading={isSubmitting}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este auxílio? 
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