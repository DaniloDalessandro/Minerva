"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { defaultColumns, optionalColumns } from "./columns";
import { fetchAuxilios, Auxilio, createAuxilio, updateAuxilio, deleteAuxilio } from "@/lib/api/auxilios";
import { fetchColaboradores, fetchBudgetLines } from "@/lib/api/auxilios";
import AuxilioForm from "@/components/forms/AuxilioForm";
import { useOptimisticAuxilios } from "@/hooks/useOptimisticAuxilios";
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

export default function AuxiliosPage() {
  // Use optimistic auxilios hook for better state management
  const {
    auxilios,
    totalCount: totalAuxilios,
    isLoading,
    setAuxilios,
    setTotalCount,
    setLoading,
    addOptimisticAuxilio,
    replaceOptimisticAuxilio,
    removeOptimisticAuxilio,
    updateAuxilio: updateOptimisticAuxilio
  } = useOptimisticAuxilios();

  // Pagination and filtering states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Form states
  const [auxilioFormOpen, setAuxilioFormOpen] = useState(false);
  const [editingAuxilio, setEditingAuxilio] = useState<Auxilio | null>(null);
  
  // Delete dialog states
  const [deleteAuxilioDialogOpen, setDeleteAuxilioDialogOpen] = useState(false);
  const [auxilioToDelete, setAuxilioToDelete] = useState<Auxilio | null>(null);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combine default and optional columns - DataTable will handle visibility
  const allColumns = useMemo(() => {
    return [...defaultColumns, ...optionalColumns];
  }, []);

  const convertSortingToOrdering = (sorting: { id: string; desc: boolean }[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  };

  // Load auxilios function
  const loadAuxilios = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading auxilios with params:", { page, pageSize, search, sorting, filters });
      
      const ordering = convertSortingToOrdering(sorting);
      
      // Build search params including filters - use the most recent filter value
      const filterValues = Object.values(filters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : search;
      
      const data = await fetchAuxilios(page, pageSize, searchParam, ordering);
      setAuxilios(data.results);
      setTotalCount(data.count);
      console.log("✅ Auxilios loaded successfully:", data.results.length, "items");
    } catch (error) {
      console.error("❌ Erro ao carregar auxílios:", error);
      // Could add user-friendly error notification here
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sorting, filters, setAuxilios, setTotalCount, setLoading]);

  useEffect(() => {
    loadAuxilios();
  }, [loadAuxilios]);

  // Register refresh function for AppSidebar
  useRegisterRefresh('auxilios', loadAuxilios);

  // Check for edit mode from session storage (when coming back from details page)
  useEffect(() => {
    const editAuxilioId = window.sessionStorage.getItem('editAuxilioId');
    if (editAuxilioId) {
      window.sessionStorage.removeItem('editAuxilioId');
      // Find the auxilio to edit
      const auxilioToEdit = auxilios.find(a => a.id.toString() === editAuxilioId);
      if (auxilioToEdit) {
        setEditingAuxilio(auxilioToEdit);
        setAuxilioFormOpen(true);
      }
    }
  }, [auxilios]);

  const handleViewDetails = (auxilio: Auxilio) => {
    // Open auxilio details in new tab
    window.open(`/auxilios/${auxilio.id}`, '_blank');
  };

  const handleAddAuxilio = () => {
    setEditingAuxilio(null);
    setAuxilioFormOpen(true);
  };

  const handleEditAuxilio = (auxilio: Auxilio) => {
    setEditingAuxilio(auxilio);
    setAuxilioFormOpen(true);
  };

  const handleDeleteAuxilio = (auxilio: Auxilio) => {
    setAuxilioToDelete(auxilio);
    setDeleteAuxilioDialogOpen(true);
  };

  const confirmDeleteAuxilio = async () => {
    if (auxilioToDelete?.id) {
      try {
        await deleteAuxilio(auxilioToDelete.id);
        await loadAuxilios(); // Reload the list
        if (auxilios.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir auxílio:", error);
      } finally {
        setDeleteAuxilioDialogOpen(false);
        setAuxilioToDelete(null);
      }
    }
  };

  const handleAuxilioSubmit = async (auxilioData: any) => {
    let tempId: number | null = null;
    
    try {
      setIsSubmitting(true);
      console.log("💾 Submitting auxilio data:", auxilioData);
      
      const isEditing = auxilioData.id;
      
      if (isEditing) {
        console.log("📝 Updating existing auxilio with ID:", auxilioData.id);
        const result = await updateAuxilio(auxilioData);
        
        // Extract the actual auxilio data from the API response
        const updatedAuxilio = result.data || result;
        console.log("✅ Auxilio update successful:", updatedAuxilio);
        
        // Update the auxilio in the list
        updateOptimisticAuxilio(updatedAuxilio);
        
      } else {
        console.log("➕ Creating new auxilio...");
        
        // Find the selected employee and budget line for better optimistic UI
        let selectedEmployee = null;
        let selectedBudgetLine = null;
        
        if (auxilioData.employee) {
          try {
            const colaboradores = await fetchColaboradores();
            selectedEmployee = colaboradores.find((emp: any) => emp.id === auxilioData.employee);
          } catch (error) {
            console.warn("Could not fetch colaboradores for optimistic UI");
          }
        }
        
        if (auxilioData.budget_line) {
          try {
            const budgetLines = await fetchBudgetLines();
            selectedBudgetLine = budgetLines.find((bl: any) => bl.id === auxilioData.budget_line);
          } catch (error) {
            console.warn("Could not fetch budget lines for optimistic UI");
          }
        }
        
        // Add optimistic entry for immediate UI feedback
        tempId = addOptimisticAuxilio({
          ...auxilioData,
          employee: selectedEmployee,
          budget_line: selectedBudgetLine
        });
        
        // Make the API call
        const result = await createAuxilio(auxilioData);
        
        // Extract the actual auxilio data from the API response
        const newAuxilio = result.data || result;
        console.log("✅ Auxilio creation successful:", newAuxilio);
        
        // Replace optimistic entry with real data
        replaceOptimisticAuxilio(tempId, newAuxilio);
      }
      
      // Close form
      setAuxilioFormOpen(false);
      setEditingAuxilio(null);
      
      console.log("✅ Auxilio operation completed successfully");
      
    } catch (error) {
      console.error("❌ Erro ao salvar auxílio:", error);
      
      // If this was a creation and we have a temporary ID, remove the optimistic entry
      if (!auxilioData.id && tempId !== null) {
        removeOptimisticAuxilio(tempId);
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
          columns={allColumns}
          data={auxilios}
          title="Auxílios"
          pageSize={pageSize}
          pageIndex={page - 1}
          totalCount={totalAuxilios}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1);
          }}
          onAdd={handleAddAuxilio}
          onEdit={handleEditAuxilio}
          onDelete={handleDeleteAuxilio}
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

        <AuxilioForm
          open={auxilioFormOpen}
          handleClose={() => {
            setAuxilioFormOpen(false);
            setEditingAuxilio(null);
          }}
          initialData={editingAuxilio}
          onSubmit={handleAuxilioSubmit}
          isSubmitting={isSubmitting}
        />

        <AlertDialog
          open={deleteAuxilioDialogOpen}
          onOpenChange={setDeleteAuxilioDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o auxílio para{" "}
                <strong>{auxilioToDelete?.employee?.full_name}</strong>?
                <br />
                Tipo: <strong>{auxilioToDelete?.type}</strong>
                <br />
                Valor: <strong>R$ {auxilioToDelete?.total_amount}</strong>
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteAuxilio}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}