"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { fetchBudgetLines, BudgetLine, createBudgetLine, updateBudgetLine, deleteBudgetLine } from "@/lib/api/budgetlines";
import { fetchBudgets, fetchManagementCenters, fetchRequestingCenters, fetchEmployees } from "@/lib/api/budgetlines";
import BudgetLineForm from "@/components/forms/BudgetLineForm";
import { useOptimisticBudgetLines } from "@/hooks/useOptimisticBudgetLines";
import { useRegisterRefresh } from "@/contexts/DataRefreshContext";
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

export default function LinhasOrcamentariasPage() {
  // Use optimistic budget lines hook for better state management
  const {
    budgetLines,
    totalCount: totalBudgetLines,
    isLoading,
    setBudgetLines,
    setTotalCount,
    setLoading,
    addOptimisticBudgetLine,
    replaceOptimisticBudgetLine,
    removeOptimisticBudgetLine,
    updateBudgetLine: updateOptimisticBudgetLine
  } = useOptimisticBudgetLines();

  // Pagination and filtering states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Form states
  const [budgetLineFormOpen, setBudgetLineFormOpen] = useState(false);
  const [editingBudgetLine, setEditingBudgetLine] = useState<BudgetLine | null>(null);
  
  // Delete dialog states
  const [deleteBudgetLineDialogOpen, setDeleteBudgetLineDialogOpen] = useState(false);
  const [budgetLineToDelete, setBudgetLineToDelete] = useState<BudgetLine | null>(null);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertSortingToOrdering = (sorting: { id: string; desc: boolean }[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  };

  // Load budget lines function
  const loadBudgetLines = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading budget lines with params:", { page, pageSize, search, sorting, filters });
      
      const ordering = convertSortingToOrdering(sorting);
      
      // Build search params including filters - use the most recent filter value
      const filterValues = Object.values(filters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : search;
      
      const data = await fetchBudgetLines(page, pageSize, searchParam, ordering);
      setBudgetLines(data.results);
      setTotalCount(data.count);
      console.log("✅ Budget lines loaded successfully:", data.results.length, "items");
    } catch (error) {
      console.error("❌ Erro ao carregar linhas orçamentárias:", error);
      // Could add user-friendly error notification here
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sorting, filters, setBudgetLines, setTotalCount, setLoading]);

  useEffect(() => {
    loadBudgetLines();
  }, [loadBudgetLines]);

  useRegisterRefresh('linhas-orcamentarias', loadBudgetLines);

  // Check for edit mode from session storage (when coming back from details page)
  useEffect(() => {
    const editBudgetLineId = window.sessionStorage.getItem('editBudgetLineId');
    if (editBudgetLineId) {
      window.sessionStorage.removeItem('editBudgetLineId');
      // Find the budget line to edit
      const budgetLineToEdit = budgetLines.find(bl => bl.id.toString() === editBudgetLineId);
      if (budgetLineToEdit) {
        setEditingBudgetLine(budgetLineToEdit);
        setBudgetLineFormOpen(true);
      }
    }
  }, [budgetLines]);

  const handleViewDetails = (budgetLine: BudgetLine) => {
    // Open budget line details in new tab
    window.open(`/linhas-orcamentarias/${budgetLine.id}`, '_blank');
  };

  const handleAddBudgetLine = () => {
    setEditingBudgetLine(null);
    setBudgetLineFormOpen(true);
  };

  const handleEditBudgetLine = (budgetLine: BudgetLine) => {
    setEditingBudgetLine(budgetLine);
    setBudgetLineFormOpen(true);
  };

  const handleDeleteBudgetLine = (budgetLine: BudgetLine) => {
    setBudgetLineToDelete(budgetLine);
    setDeleteBudgetLineDialogOpen(true);
  };

  const confirmDeleteBudgetLine = async () => {
    if (budgetLineToDelete?.id) {
      try {
        await deleteBudgetLine(budgetLineToDelete.id);
        await loadBudgetLines(); // Reload the list
        if (budgetLines.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir linha orçamentária:", error);
      } finally {
        setDeleteBudgetLineDialogOpen(false);
        setBudgetLineToDelete(null);
      }
    }
  };

  const handleBudgetLineSubmit = async (budgetLineData: any) => {
    let tempId: number | null = null;
    
    try {
      setIsSubmitting(true);
      console.log("💾 Submitting budget line data:", budgetLineData);
      
      const isEditing = budgetLineData.id;
      
      if (isEditing) {
        console.log("📝 Updating existing budget line with ID:", budgetLineData.id);
        const result = await updateBudgetLine(budgetLineData);
        
        // Extract the actual budget line data from the API response
        const updatedBudgetLine = result.data || result;
        console.log("✅ Budget line update successful:", updatedBudgetLine);
        
        // Update the budget line in the list
        updateOptimisticBudgetLine(updatedBudgetLine);
        
      } else {
        console.log("➕ Creating new budget line...");
        
        // Find the selected entities for better optimistic UI
        let selectedBudget = null;
        let selectedManagementCenter = null;
        let selectedRequestingCenter = null;
        let selectedMainFiscal = null;
        let selectedSecondaryFiscal = null;
        
        if (budgetLineData.budget) {
          try {
            const budgets = await fetchBudgets();
            selectedBudget = budgets.find((b: any) => b.id === budgetLineData.budget);
          } catch (error) {
            console.warn("Could not fetch budgets for optimistic UI");
          }
        }
        
        if (budgetLineData.management_center) {
          try {
            const centers = await fetchManagementCenters();
            selectedManagementCenter = centers.find((c: any) => c.id === budgetLineData.management_center);
          } catch (error) {
            console.warn("Could not fetch management centers for optimistic UI");
          }
        }
        
        if (budgetLineData.requesting_center) {
          try {
            const centers = await fetchRequestingCenters();
            selectedRequestingCenter = centers.find((c: any) => c.id === budgetLineData.requesting_center);
          } catch (error) {
            console.warn("Could not fetch requesting centers for optimistic UI");
          }
        }
        
        if (budgetLineData.main_fiscal) {
          try {
            const employees = await fetchEmployees();
            selectedMainFiscal = employees.find((e: any) => e.id === budgetLineData.main_fiscal);
          } catch (error) {
            console.warn("Could not fetch employees for optimistic UI");
          }
        }
        
        if (budgetLineData.secondary_fiscal) {
          try {
            const employees = await fetchEmployees();
            selectedSecondaryFiscal = employees.find((e: any) => e.id === budgetLineData.secondary_fiscal);
          } catch (error) {
            console.warn("Could not fetch employees for optimistic UI");
          }
        }
        
        // Add optimistic entry for immediate UI feedback
        tempId = addOptimisticBudgetLine({
          ...budgetLineData,
          budget: selectedBudget,
          management_center: selectedManagementCenter,
          requesting_center: selectedRequestingCenter,
          main_fiscal: selectedMainFiscal,
          secondary_fiscal: selectedSecondaryFiscal
        });
        
        // Make the API call
        const result = await createBudgetLine(budgetLineData);
        
        // Extract the actual budget line data from the API response
        const newBudgetLine = result.data || result;
        console.log("✅ Budget line creation successful:", newBudgetLine);
        
        // Replace optimistic entry with real data
        replaceOptimisticBudgetLine(tempId, newBudgetLine);
      }
      
      // Close form
      setBudgetLineFormOpen(false);
      setEditingBudgetLine(null);
      
      console.log("✅ Budget line operation completed successfully");
      
    } catch (error) {
      console.error("❌ Erro ao salvar linha orçamentária:", error);
      
      // If this was a creation and we have a temporary ID, remove the optimistic entry
      if (!budgetLineData.id && tempId !== null) {
        removeOptimisticBudgetLine(tempId);
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
          columns={columns}
          data={budgetLines}
          title="Linhas Orçamentárias"
          pageSize={pageSize}
          pageIndex={page - 1}
          totalCount={totalBudgetLines}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1);
          }}
          onAdd={handleAddBudgetLine}
          onEdit={handleEditBudgetLine}
          onDelete={handleDeleteBudgetLine}
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

        <BudgetLineForm
          open={budgetLineFormOpen}
          handleClose={() => {
            setBudgetLineFormOpen(false);
            setEditingBudgetLine(null);
          }}
          initialData={editingBudgetLine}
          onSubmit={handleBudgetLineSubmit}
          isSubmitting={isSubmitting}
        />

        <AlertDialog
          open={deleteBudgetLineDialogOpen}
          onOpenChange={setDeleteBudgetLineDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a linha orçamentária{" "}
                <strong>{budgetLineToDelete?.summary_description}</strong>?
                <br />
                Orçamento: <strong>{budgetLineToDelete?.budget?.name}</strong>
                <br />
                Valor: <strong>R$ {budgetLineToDelete?.budgeted_amount}</strong>
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteBudgetLine}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}