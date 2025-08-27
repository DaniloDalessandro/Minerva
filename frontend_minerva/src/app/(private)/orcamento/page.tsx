"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { fetchBudgets, Budget, createBudget, updateBudget } from "@/lib/api/budgets";
import BudgetForm from "@/components/forms/BudgetForm";

export default function BudgetPage() {
  // States for budget data
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [totalBudgets, setTotalBudgets] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Form states
  const [budgetFormOpen, setBudgetFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

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

  const handleViewDetails = (budget: Budget) => {
    // Open budget details in new tab
    window.open(`/orcamento/${budget.id}`, '_blank');
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setBudgetFormOpen(true);
  };

  const handleBudgetSubmit = async (budgetData: any) => {
    try {
      console.log("💾 Submitting budget data:", budgetData);
      
      let result;
      if (budgetData.id) {
        console.log("📝 Updating existing budget...");
        result = await updateBudget(budgetData);
      } else {
        console.log("➕ Creating new budget...");
        result = await createBudget(budgetData);
      }
      
      console.log("✅ Budget operation successful:", result);
      
      // Close form first
      setBudgetFormOpen(false);
      
      // Then refresh the list
      console.log("🔄 Refreshing budget list...");
      await loadBudgets();
      console.log("✅ Budget list refreshed successfully");
      
    } catch (error) {
      console.error("❌ Erro ao salvar orçamento:", error);
      // Handle error - show user notification here if needed
      // For now, we'll keep the form open so user can try again
    }
  };

  return (
    <div className="container mx-auto py-1 px-2">
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
          handleClose={() => setBudgetFormOpen(false)}
          initialData={editingBudget}
          onSubmit={handleBudgetSubmit}
        />

      </div>
    </div>
  );
}