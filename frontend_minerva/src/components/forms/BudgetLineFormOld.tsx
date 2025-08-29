"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetLine, fetchBudgets, fetchManagementCenters, fetchRequestingCenters, fetchEmployees } from "@/lib/api/budgetlines";

interface BudgetLineFormProps {
  open: boolean;
  handleClose: () => void;
  initialData: BudgetLine | null;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

interface Budget {
  id: number;
  name: string;
}

interface Center {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  full_name: string;
  employee_id?: string;
}

export default function BudgetLineForm({
  open,
  handleClose,
  initialData,
  onSubmit,
  isSubmitting = false,
}: BudgetLineFormProps) {
  const [formData, setFormData] = useState<any>({
    id: undefined,
    budget: 0,
    category: "OPEX",
    expense_type: "Base Principal",
    management_center: 0,
    requesting_center: 0,
    summary_description: "",
    object: "",
    budget_classification: "NOVO",
    main_fiscal: null,
    secondary_fiscal: null,
    contract_type: "SERVIÇO",
    probable_procurement_type: "LICITAÇÃO",
    budgeted_amount: "",
    process_status: null,
    contract_status: null,
    contract_notes: "",
  });

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [managementCenters, setManagementCenters] = useState<Center[]>([]);
  const [requestingCenters, setRequestingCenters] = useState<Center[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load dropdown data
  useEffect(() => {
    async function loadDropdownData() {
      try {
        setLoadingData(true);
        console.log("🔍 Fetching dropdown data...");
        
        const [budgetsData, managementCentersData, requestingCentersData, employeesData] = await Promise.all([
          fetchBudgets(),
          fetchManagementCenters(),
          fetchRequestingCenters(),
          fetchEmployees()
        ]);
        
        console.log("📋 Dropdown data loaded:", {
          budgets: budgetsData.length,
          managementCenters: managementCentersData.length,
          requestingCenters: requestingCentersData.length,
          employees: employeesData.length
        });
        
        setBudgets(budgetsData);
        setManagementCenters(managementCentersData);
        setRequestingCenters(requestingCentersData);
        setEmployees(employeesData);
        
      } catch (error) {
        console.error("❌ Erro ao carregar dados dos dropdowns:", error);
        setErrors(prev => ({
          ...prev, 
          budget: "Erro ao carregar dados. Verifique sua conexão."
        }));
      } finally {
        setLoadingData(false);
      }
    }
    
    if (open) {
      loadDropdownData();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (initialData) {
        console.log("📝 Editing existing budget line:", initialData);
        setFormData({
          id: initialData.id,
          budget: initialData.budget?.id || 0,
          category: initialData.category || "OPEX",
          expense_type: initialData.expense_type || "Base Principal",
          management_center: initialData.management_center?.id || 0,
          requesting_center: initialData.requesting_center?.id || 0,
          summary_description: initialData.summary_description || "",
          object: initialData.object || "",
          budget_classification: initialData.budget_classification || "NOVO",
          main_fiscal: initialData.main_fiscal?.id || null,
          secondary_fiscal: initialData.secondary_fiscal?.id || null,
          contract_type: initialData.contract_type || "SERVIÇO",
          probable_procurement_type: initialData.probable_procurement_type || "LICITAÇÃO",
          budgeted_amount: initialData.budgeted_amount || "",
          process_status: initialData.process_status || null,
          contract_status: initialData.contract_status || null,
          contract_notes: initialData.contract_notes || "",
        });
      } else {
        console.log("➕ Creating new budget line - resetting form");
        setFormData({
          id: undefined,
          budget: 0,
          category: "OPEX",
          expense_type: "Base Principal",
          management_center: 0,
          requesting_center: 0,
          summary_description: "",
          object: "",
          budget_classification: "NOVO",
          main_fiscal: null,
          secondary_fiscal: null,
          contract_type: "SERVIÇO",
          probable_procurement_type: "LICITAÇÃO",
          budgeted_amount: "",
          process_status: null,
          contract_status: null,
          contract_notes: "",
        });
      }
      setErrors({});
    }
  }, [open, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id === 'budgeted_amount') {
      // Format as currency but store as string
      setFormData({ ...formData, [id]: value });
    } else {
      setFormData({ ...formData, [id]: value });
    }
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: 
      field === 'budget' || field === 'management_center' || field === 'requesting_center' || 
      field === 'main_fiscal' || field === 'secondary_fiscal'
        ? (value === "" ? null : parseInt(value))
        : value 
    });
    
    // Clear error when user selects
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.budget || formData.budget === 0) {
      newErrors.budget = "Orçamento é obrigatório";
    }

    if (!formData.expense_type) {
      newErrors.expense_type = "Tipo de despesa é obrigatório";
    }

    if (!formData.management_center || formData.management_center === 0) {
      newErrors.management_center = "Centro gestor é obrigatório";
    }

    if (!formData.requesting_center || formData.requesting_center === 0) {
      newErrors.requesting_center = "Centro solicitante é obrigatório";
    }

    if (!formData.summary_description) {
      newErrors.summary_description = "Descrição resumida é obrigatória";
    }

    if (!formData.object) {
      newErrors.object = "Objeto é obrigatório";
    }

    if (!formData.probable_procurement_type) {
      newErrors.probable_procurement_type = "Tipo de aquisição é obrigatório";
    }

    if (!formData.budgeted_amount) {
      newErrors.budgeted_amount = "Valor orçado é obrigatório";
    } else {
      const budgetedAmount = parseFloat(formData.budgeted_amount.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (isNaN(budgetedAmount) || budgetedAmount < 0.01) {
        newErrors.budgeted_amount = "Valor orçado deve ser um número válido maior ou igual a 0.01";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loadingData) {
      console.warn("⚠️ Form submission blocked - data still loading");
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for submission (convert 0 values to null for foreign keys)
    const submitData = {
      ...formData,
      budget: formData.budget > 0 ? formData.budget : null,
      management_center: formData.management_center > 0 ? formData.management_center : null,
      requesting_center: formData.requesting_center > 0 ? formData.requesting_center : null,
      main_fiscal: formData.main_fiscal > 0 ? formData.main_fiscal : null,
      secondary_fiscal: formData.secondary_fiscal > 0 ? formData.secondary_fiscal : null,
      // Ensure string values
      budgeted_amount: formData.budgeted_amount.toString(),
    };

    onSubmit(submitData);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'CAPEX':
        return 'CAPEX';
      case 'OPEX':
        return 'OPEX';
      default:
        return category;
    }
  };

  const getExpenseTypeLabel = (type: string) => {
    switch (type) {
      case 'Base Principal':
        return 'Base Principal';
      case 'Serviços Especializados':
        return 'Serviços Especializados';
      case 'Despesas Compartilhadas':
        return 'Despesas Compartilhadas';
      default:
        return type;
    }
  };

  const getBudgetClassificationLabel = (classification: string) => {
    switch (classification) {
      case 'NOVO':
        return 'Novo';
      case 'RENOVAÇÃO':
        return 'Renovação';
      case 'CARY OVER':
        return 'Cary Over';
      case 'REPLANEJAMENTO':
        return 'Replanejamento';
      case 'N/A':
        return 'N/A';
      default:
        return classification;
    }
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'SERVIÇO':
        return 'Serviço';
      case 'FORNECIMENTO':
        return 'Fornecimento';
      case 'ASSINATURA':
        return 'Assinatura';
      case 'FORNECIMENTO/SERVIÇO':
        return 'Fornecimento/Serviço';
      default:
        return type;
    }
  };

  const getProcurementTypeLabel = (type: string) => {
    switch (type) {
      case 'LICITAÇÃO':
        return 'Licitação';
      case 'DISPENSA EM RAZÃO DO VALOR':
        return 'Dispensa em Razão do Valor';
      case 'CONVÊNIO':
        return 'Convênio';
      case 'FUNDO FIXO':
        return 'Fundo Fixo';
      case 'INEXIGIBILIDADE':
        return 'Inexigibilidade';
      case 'ATA DE REGISTRO DE PREÇO':
        return 'Ata de Registro de Preço';
      case 'ACORDO DE COOPERAÇÃO':
        return 'Acordo de Cooperação';
      case 'APOSTILAMENTO':
        return 'Apostilamento';
      default:
        return type;
    }
  };

  const getProcessStatusLabel = (status: string) => {
    switch (status) {
      case 'VENCIDO':
        return 'Vencido';
      case 'DENTRO DO PRAZO':
        return 'Dentro do Prazo';
      case 'ELABORADO COM ATRASO':
        return 'Elaborado com Atraso';
      case 'ELABORADO NO PRAZO':
        return 'Elaborado no Prazo';
      default:
        return status;
    }
  };

  const getContractStatusLabel = (status: string) => {
    switch (status) {
      case 'DENTRO DO PRAZO':
        return 'Dentro do Prazo';
      case 'CONTRATADO NO PRAZO':
        return 'Contratado no Prazo';
      case 'CONTRATADO COM ATRASO':
        return 'Contratado com Atraso';
      case 'PRAZO VENCIDO':
        return 'Prazo Vencido';
      case 'LINHA TOTALMENTE REMANEJADA':
        return 'Totalmente Remanejada';
      case 'LINHA TOTALMENTE EXECUTADA':
        return 'Totalmente Executada';
      case 'LINHA DE PAGAMENTO':
        return 'Linha de Pagamento';
      case 'LINHA PARCIALMENTE REMANEJADA':
        return 'Parcialmente Remanejada';
      case 'LINHA PARCIALMENTE EXECUTADA':
        return 'Parcialmente Executada';
      case 'N/A':
        return 'N/A';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-primary">
              {initialData ? "Editar Linha Orçamentária" : "Nova Linha Orçamentária"}
            </DialogTitle>
            <hr className="mt-2 border-b border-gray-200" />
          </DialogHeader>

          <div className="grid gap-4 py-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento *</Label>
              <Select 
                value={formData.budget.toString()} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, budget: parseInt(value) }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um orçamento" />
                </SelectTrigger>
                <SelectContent>
                  {activeBudgets.map((budget) => (
                    <SelectItem key={budget.id} value={budget.id.toString()}>
                      {budget.category} {budget.year} - R$ {parseFloat(budget.available_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={formData.category || "OPEX"} 
                onValueChange={(value: "CAPEX" | "OPEX") => 
                  setFormData(prev => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAPEX">CAPEX</SelectItem>
                  <SelectItem value="OPEX">OPEX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary_description">Descrição Resumida</Label>
            <Input
              id="summary_description"
              value={formData.summary_description}
              onChange={(e) => setFormData(prev => ({ ...prev, summary_description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense_type">Tipo de Despesa *</Label>
              <Select 
                value={formData.expense_type} 
                onValueChange={(value: any) => 
                  setFormData(prev => ({ ...prev, expense_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Base Principal">Base Principal</SelectItem>
                  <SelectItem value="Serviços Especializados">Serviços Especializados</SelectItem>
                  <SelectItem value="Despesas Compartilhadas">Despesas Compartilhadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="object">Objeto</Label>
              <Input
                id="object"
                value={formData.object}
                onChange={(e) => setFormData(prev => ({ ...prev, object: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="management_center">Centro Gestor</Label>
              <Select 
                value={formData.management_center?.toString() || ""} 
                onValueChange={handleManagementCenterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um centro gestor" />
                </SelectTrigger>
                <SelectContent>
                  {managementCenters.map((center) => (
                    <SelectItem key={center.id} value={center.id.toString()}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requesting_center">Centro Solicitante</Label>
              <Select 
                value={formData.requesting_center?.toString() || ""} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, requesting_center: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um centro solicitante" />
                </SelectTrigger>
                <SelectContent>
                  {filteredRequestingCenters.map((center) => (
                    <SelectItem key={center.id} value={center.id.toString()}>
                      {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgeted_amount">Valor Orçado *</Label>
              <Input
                id="budgeted_amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.budgeted_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, budgeted_amount: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_classification">Classificação Orçamentária</Label>
              <Select 
                value={formData.budget_classification || "NOVO"} 
                onValueChange={(value: any) => 
                  setFormData(prev => ({ ...prev, budget_classification: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NOVO">Novo</SelectItem>
                  <SelectItem value="RENOVAÇÃO">Renovação</SelectItem>
                  <SelectItem value="CARY OVER">Cary Over</SelectItem>
                  <SelectItem value="REPLANEJAMENTO">Replanejamento</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_type">Tipo de Contrato</Label>
              <Select 
                value={formData.contract_type || "SERVIÇO"} 
                onValueChange={(value: any) => 
                  setFormData(prev => ({ ...prev, contract_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SERVIÇO">Serviço</SelectItem>
                  <SelectItem value="FORNECIMENTO">Fornecimento</SelectItem>
                  <SelectItem value="ASSINATURA">Assinatura</SelectItem>
                  <SelectItem value="FORNECIMENTO/SERVIÇO">Fornecimento/Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="probable_procurement_type">Tipo de Aquisição *</Label>
            <Select 
              value={formData.probable_procurement_type} 
              onValueChange={(value: any) => 
                setFormData(prev => ({ ...prev, probable_procurement_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LICITAÇÃO">Licitação</SelectItem>
                <SelectItem value="DISPENSA EM RAZÃO DO VALOR">Dispensa em razão do valor</SelectItem>
                <SelectItem value="CONVÊNIO">Convênio</SelectItem>
                <SelectItem value="FUNDO FIXO">Fundo Fixo</SelectItem>
                <SelectItem value="INEXIGIBILIDADE">Inexigibilidade</SelectItem>
                <SelectItem value="ATA DE REGISTRO DE PREÇO">Ata de Registro de Preço</SelectItem>
                <SelectItem value="ACORDO DE COOPERAÇÃO">Acordo de Cooperação</SelectItem>
                <SelectItem value="APOSTILAMENTO">Apostilamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="main_fiscal">Fiscal Principal</Label>
              <Select 
                value={formData.main_fiscal?.toString() || ""} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, main_fiscal: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fiscal principal" />
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_fiscal">Fiscal Substituto</Label>
              <Select 
                value={formData.secondary_fiscal?.toString() || ""} 
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, secondary_fiscal: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o fiscal substituto" />
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees
                    .filter(emp => emp.id !== formData.main_fiscal)
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.full_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract_notes">Observações</Label>
            <Textarea
              id="contract_notes"
              value={formData.contract_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, contract_notes: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.budget}>
              {isLoading ? "Salvando..." : budgetLine ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}