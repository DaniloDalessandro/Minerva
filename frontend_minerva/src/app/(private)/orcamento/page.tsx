"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { fetchBudgets, Budget, createBudget, updateBudget, deleteBudget } from "@/lib/api/budgets";
import ContractViewModal from "@/components/modals/ContractViewModal";
import BudgetForm from "@/components/forms/BudgetForm";
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
  // States for budget data
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalBudgets, setTotalBudgets] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Modal states
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [budgetFormOpen, setBudgetFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteBudgetDialogOpen, setDeleteBudgetDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  const convertSortingToOrdering = (sorting: { id: string; desc: boolean }[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  };

  // Load budgets function
  const loadBudgets = useCallback(async () => {
    try {
      const ordering = convertSortingToOrdering(sorting);
      
      // Build search params including filters - use the most recent filter value
      const filterValues = Object.values(filters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : search;
      
      const data = await fetchBudgets(page, pageSize, searchParam, ordering);
      setBudgets(data.results);
      setTotalBudgets(data.count);
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
    }
  }, [page, pageSize, search, sorting, filters]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleViewContracts = (budget: Budget) => {
    setSelectedBudget(budget);
    setContractModalOpen(true);
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
        await loadBudgets();
        // If we deleted the last item on the page, go back one page
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
    try {
      if (budgetData.id) {
        await updateBudget(budgetData);
      } else {
        await createBudget(budgetData);
      }
      await loadBudgets();
      setBudgetFormOpen(false);
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
    }
  };

  return (
    <div className="container mx-auto py-1 px-2">
      <div className="space-y-2">
        <DataTable
          columns={columns(handleViewContracts, handleEditBudget, handleDeleteBudget)}
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

        <ContractViewModal
          open={contractModalOpen}
          onOpenChange={setContractModalOpen}
          budget={selectedBudget}
        />

        <BudgetForm
          open={budgetFormOpen}
          handleClose={() => setBudgetFormOpen(false)}
          initialData={editingBudget}
          onSubmit={handleBudgetSubmit}
        />

        <AlertDialog
          open={deleteBudgetDialogOpen}
          onOpenChange={setDeleteBudgetDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o orçamento do ano {budgetToDelete?.year} - {budgetToDelete?.management_center?.name}? Esta ação não pode ser desfeita.
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