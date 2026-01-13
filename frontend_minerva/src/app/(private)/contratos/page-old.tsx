"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { contractColumns, ContractForm, useOptimisticContracts, type Contract } from "@/features/contratos";
import { ContractService, ColaboradorService, BudgetLineService } from "@/services";
import { useRegisterRefresh } from "@/context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ContratosPage() {
  // Use optimistic contracts hook for better state management
  const {
    contracts,
    totalCount: totalContracts,
    isLoading,
    setContracts,
    setTotalCount,
    setLoading,
    addOptimisticContract,
    replaceOptimisticContract,
    removeOptimisticContract,
    updateContract: updateOptimisticContract
  } = useOptimisticContracts();

  // Pagination and filtering states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Form states
  const [contractFormOpen, setContractFormOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  
  // Delete dialog states
  const [deleteContractDialogOpen, setDeleteContractDialogOpen] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertSortingToOrdering = (sorting: { id: string; desc: boolean }[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  };

  // Load contracts function
  const loadContratos = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading contracts with params:", { page, pageSize, search, sorting, filters });
      
      const ordering = convertSortingToOrdering(sorting);
      
      // Build search params including filters - use the most recent filter value
      const filterValues = Object.values(filters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : search;
      
      const data = await ContractService.fetchContracts(page, pageSize, searchParam, ordering);
      setContracts(data.results);
      setTotalCount(data.count);
      console.log("✅ Contracts loaded successfully:", data.results.length, "items");
    } catch (error) {
      console.error("❌ Erro ao carregar contratos:", error);
      // Could add user-friendly error notification here
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sorting, filters, setContracts, setTotalCount, setLoading]);

  useEffect(() => {
    loadContratos();
  }, [loadContratos]);

  useRegisterRefresh('contratos', loadContratos);

  // Check for edit mode from session storage (when coming back from details page)
  useEffect(() => {
    const editContractId = window.sessionStorage.getItem('editContractId');
    if (editContractId) {
      window.sessionStorage.removeItem('editContractId');
      // Find the contract to edit
      const contractToEdit = contracts.find(c => c.id.toString() === editContractId);
      if (contractToEdit) {
        setEditingContract(contractToEdit);
        setContractFormOpen(true);
      }
    }
  }, [contracts]);

  const handleViewDetails = (contract: Contract) => {
    // Open contract details in new tab
    window.open(`/contratos/${contract.id}`, '_blank');
  };

  const handleAddContract = () => {
    setEditingContract(null);
    setContractFormOpen(true);
  };

  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract);
    setContractFormOpen(true);
  };

  const handleDeleteContract = (contract: Contract) => {
    setContractToDelete(contract);
    setDeleteContractDialogOpen(true);
  };

  const confirmDeleteContract = async () => {
    if (contractToDelete?.id) {
      try {
        await ContractService.deleteContract(contractToDelete.id);
        await loadContratos(); // Reload the list
        if (contracts.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir contrato:", error);
      } finally {
        setDeleteContractDialogOpen(false);
        setContractToDelete(null);
      }
    }
  };

  const handleContractSubmit = async (contractData: any) => {
    let tempId: number | null = null;
    
    try {
      setIsSubmitting(true);
      console.log("💾 Submitting contract data:", contractData);
      
      const isEditing = contractData.id;
      
      if (isEditing) {
        console.log("📝 Updating existing contract with ID:", contractData.id);
        const result = await ContractService.updateContract(contractData);
        
        // Extract the actual contract data from the API response
        const updatedContract = result.data || result;
        console.log("✅ Contract update successful:", updatedContract);
        
        // Update the contract in the list
        updateOptimisticContract(updatedContract);
        
      } else {
        console.log("➕ Creating new contract...");
        
        // Find the selected employees and budget line for better optimistic UI
        let selectedMainInspector = null;
        let selectedSubstituteInspector = null;
        let selectedBudgetLine = null;
        
        if (contractData.main_inspector) {
          try {
            const data = await ColaboradorService.fetchColaboradores(1, 1000);
            selectedMainInspector = data.results.find((emp: any) => emp.id === contractData.main_inspector);
          } catch (error) {
            console.warn("Could not fetch employees for optimistic UI");
          }
        }

        if (contractData.substitute_inspector) {
          try {
            const data = await ColaboradorService.fetchColaboradores(1, 1000);
            selectedSubstituteInspector = data.results.find((emp: any) => emp.id === contractData.substitute_inspector);
          } catch (error) {
            console.warn("Could not fetch employees for optimistic UI");
          }
        }

        if (contractData.budget_line) {
          try {
            const data = await BudgetLineService.fetchBudgetLines(1, 1000);
            selectedBudgetLine = data.results.find((bl: any) => bl.id === contractData.budget_line);
          } catch (error) {
            console.warn("Could not fetch budget lines for optimistic UI");
          }
        }
        
        // Add optimistic entry for immediate UI feedback
        tempId = addOptimisticContract({
          ...contractData,
          main_inspector: selectedMainInspector,
          substitute_inspector: selectedSubstituteInspector,
          budget_line: selectedBudgetLine
        });
        
        // Make the API call
        const result = await ContractService.createContract(contractData);
        
        // Extract the actual contract data from the API response
        const newContract = result.data || result;
        console.log("✅ Contract creation successful:", newContract);
        
        // Replace optimistic entry with real data
        replaceOptimisticContract(tempId, newContract);
      }
      
      // Close form
      setContractFormOpen(false);
      setEditingContract(null);
      
      console.log("✅ Contract operation completed successfully");
      
    } catch (error) {
      console.error("❌ Erro ao salvar contrato:", error);
      
      // If this was a creation and we have a temporary ID, remove the optimistic entry
      if (!contractData.id && tempId !== null) {
        removeOptimisticContract(tempId);
      }
      
      // Handle error - show user notification here if needed
      // For now, we'll keep the form open so user can try again
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-1">
      <div className="space-y-2">
        <DataTable
          columns={contractColumns}
          data={contracts}
          title="Contratos"
          pageSize={pageSize}
          pageIndex={page - 1}
          totalCount={totalContracts}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1);
          }}
          onAdd={handleAddContract}
          onEdit={handleEditContract}
          onDelete={handleDeleteContract}
          onViewDetails={handleViewDetails}
          onFilterChange={(columnId, value) => {
            const newFilters = { ...filters };
            if (value) {
              newFilters[columnId] = value;
            } else {
              delete newFilters[columnId];
            }
            setFilters(newFilters);
            setPage(1);
          }}
          onSortingChange={(newSorting) => {
            setSorting(newSorting);
            setPage(1);
          }}
        />

        <ContractForm
          open={contractFormOpen}
          handleClose={() => {
            setContractFormOpen(false);
            setEditingContract(null);
          }}
          initialData={editingContract}
          onSubmit={handleContractSubmit}
          isSubmitting={isSubmitting}
        />

        <AlertDialog
          open={deleteContractDialogOpen}
          onOpenChange={setDeleteContractDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o contrato{" "}
                <strong>#{contractToDelete?.protocol_number}</strong>?
                <br />
                Fiscal Principal: <strong>{contractToDelete?.main_inspector?.full_name}</strong>
                <br />
                Valor Original: <strong>R$ {contractToDelete?.original_value}</strong>
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteContract}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}