"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { fetchBudgets, Budget, createBudget, updateBudget, deleteBudget } from "@/lib/api/budgets";
import { fetchManagementCenters } from "@/lib/api/centers";
import BudgetForm from "@/components/forms/BudgetForm";
import { useOptimisticBudgets } from "@/hooks/useOptimisticBudgets";
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

export default function BudgetPage() {
  // Use optimistic budgets hook for better state management
  const {
    budgets,
    totalCount: totalBudgets,
    isLoading,
    setBudgets,
    setTotalCount,
    setLoading,
    addOptimisticBudget,
    replaceOptimisticBudget,
    removeOptimisticBudget,
    updateBudget: updateOptimisticBudget
  } = useOptimisticBudgets();

  // Pagination and filtering states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Form states
  const [budgetFormOpen, setBudgetFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  
  // Delete dialog states
  const [deleteBudgetDialogOpen, setDeleteBudgetDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertSortingToOrdering = (sorting: { id: string; desc: boolean }[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  };

  // Load budgets function
  const loadBudgets = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading budgets with params:", { page, pageSize, search, sorting, filters });
      
      const ordering = convertSortingToOrdering(sorting);
      
      // Build search params including filters - use the most recent filter value
      const filterValues = Object.values(filters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : search;
      
      const data = await fetchBudgets(page, pageSize, searchParam, ordering);
      setBudgets(data.results);
      setTotalCount(data.count);
      console.log("✅ Budgets loaded successfully:", data.results.length, "items");
    } catch (error) {
      console.error("❌ Erro ao carregar orçamentos:", error);
      // Could add user-friendly error notification here
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sorting, filters, setBudgets, setTotalCount, setLoading]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  useRegisterRefresh('orcamentos', loadBudgets);

  const handleViewDetails = (budget: Budget) => {
    // Open budget details in new tab
    window.open(`/orcamento/${budget.id}`, '_blank');
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setBudgetFormOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setBudgetFormOpen(true);
  };

  const handleDeleteBudget = (budget: Budget) => {
    setBudgetToDelete(budget);
    setDeleteBudgetDialogOpen(true);
  };

  const confirmDeleteBudget = async () => {
    if (budgetToDelete?.id) {
      try {
        await deleteBudget(budgetToDelete.id);
        await loadBudgets(); // Reload the list
        if (budgets.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir orçamento:", error);
      } finally {
        setDeleteBudgetDialogOpen(false);
        setBudgetToDelete(null);
      }
    }
  };

  const handleBudgetSubmit = async (budgetData: any) => {
    let tempId: number | null = null;
    
    try {
      setIsSubmitting(true);
      console.log("💾 Submitting budget data:", budgetData);
      
      const isEditing = budgetData.id;
      
      if (isEditing) {
        console.log("📝 Updating existing budget with ID:", budgetData.id);
        const result = await updateBudget(budgetData);
        
        // Extract the actual budget data from the API response
        const updatedBudget = result.data || result;
        console.log("✅ Budget update successful:", updatedBudget);
        
        // Update the budget in the list
        updateOptimisticBudget(updatedBudget);
        
      } else {
        console.log("➕ Creating new budget...");
        
        // Find the selected management center for better optimistic UI
        const selectedCenter = budgetData.management_center_id ? 
          await fetchManagementCenters(1, 1000).then(data => 
            (data.results || data).find((center: any) => center.id === budgetData.management_center_id)
          ).catch(() => null) : null;
        
        // Add optimistic entry for immediate UI feedback
        tempId = addOptimisticBudget({
          ...budgetData,
          management_center: selectedCenter
        });
        
        // Make the API call
        const result = await createBudget(budgetData);
        
        // Extract the actual budget data from the API response
        const newBudget = result.data || result;
        console.log("✅ Budget creation successful:", newBudget);
        
        // Replace optimistic entry with real data
        replaceOptimisticBudget(tempId, newBudget);
      }
      
      // Close form
      setBudgetFormOpen(false);
      setEditingBudget(null);
      
      console.log("✅ Budget operation completed successfully");
      
    } catch (error) {
      console.error("❌ Erro ao salvar orçamento:", error);
      
      // If this was a creation and we have a temporary ID, remove the optimistic entry
      if (!budgetData.id && tempId !== null) {
        removeOptimisticBudget(tempId);
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
          data={budgets}
          title="Orçamentos"
          pageSize={pageSize}
          pageIndex={page - 1}
          totalCount={totalBudgets}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1);
          }}
          onAdd={handleAddBudget}
          onEdit={handleEditBudget}
          onDelete={handleDeleteBudget}
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


        <BudgetForm
          open={budgetFormOpen}
          handleClose={() => {
            setBudgetFormOpen(false);
            setEditingBudget(null);
          }}
          initialData={editingBudget}
          onSubmit={handleBudgetSubmit}
          isSubmitting={isSubmitting}
        />

        <AlertDialog
          open={deleteBudgetDialogOpen}
          onOpenChange={setDeleteBudgetDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o orçamento do ano{" "}
                {budgetToDelete?.year}?
                {budgetToDelete?.management_center?.name && (
                  <> (Centro Gestor: {budgetToDelete.management_center.name})</>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteBudget}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}