"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { fetchColaboradores, Colaborador, createColaborador, updateColaborador, deleteColaborador } from "@/lib/api/colaboradores";
import { fetchDirections, fetchManagements, fetchCoordinations } from "@/lib/api/colaboradores";
import ColaboradorForm from "@/components/forms/ColaboradorForm";
import { useOptimisticColaboradores } from "@/hooks/useOptimisticColaboradores";
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

export default function ColaboradoresPage() {
  // Use optimistic colaboradores hook for better state management
  const {
    colaboradores,
    totalCount: totalColaboradores,
    isLoading,
    setColaboradores,
    setTotalCount,
    setLoading,
    addOptimisticColaborador,
    replaceOptimisticColaborador,
    removeOptimisticColaborador,
    updateColaborador: updateOptimisticColaborador
  } = useOptimisticColaboradores();

  // Pagination and filtering states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Form states
  const [colaboradorFormOpen, setColaboradorFormOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null);
  
  // Delete dialog states
  const [deleteColaboradorDialogOpen, setDeleteColaboradorDialogOpen] = useState(false);
  const [colaboradorToDelete, setColaboradorToDelete] = useState<Colaborador | null>(null);
  
  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertSortingToOrdering = (sorting: { id: string; desc: boolean }[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  };

  // Load colaboradores function
  const loadColaboradores = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading colaboradores with params:", { page, pageSize, search, sorting, filters });
      
      const ordering = convertSortingToOrdering(sorting);
      
      // Build search params including filters - use the most recent filter value
      const filterValues = Object.values(filters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : search;
      
      const data = await fetchColaboradores(page, pageSize, searchParam, ordering);
      setColaboradores(data.results);
      setTotalCount(data.count);
      console.log("✅ Colaboradores loaded successfully:", data.results.length, "items");
    } catch (error) {
      console.error("❌ Erro ao carregar colaboradores:", error);
      // Could add user-friendly error notification here
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sorting, filters, setColaboradores, setTotalCount, setLoading]);

  useEffect(() => {
    loadColaboradores();
  }, [loadColaboradores]);

  // Check for edit mode from session storage (when coming back from details page)
  useEffect(() => {
    const editColaboradorId = window.sessionStorage.getItem('editColaboradorId');
    if (editColaboradorId) {
      window.sessionStorage.removeItem('editColaboradorId');
      // Find the colaborador to edit
      const colaboradorToEdit = colaboradores.find(c => c.id.toString() === editColaboradorId);
      if (colaboradorToEdit) {
        setEditingColaborador(colaboradorToEdit);
        setColaboradorFormOpen(true);
      }
    }
  }, [colaboradores]);

  const handleViewDetails = (colaborador: Colaborador) => {
    // Open colaborador details in new tab
    window.open(`/colaboradores/${colaborador.id}`, '_blank');
  };

  const handleAddColaborador = () => {
    setEditingColaborador(null);
    setColaboradorFormOpen(true);
  };

  const handleEditColaborador = (colaborador: Colaborador) => {
    setEditingColaborador(colaborador);
    setColaboradorFormOpen(true);
  };

  const handleDeleteColaborador = (colaborador: Colaborador) => {
    setColaboradorToDelete(colaborador);
    setDeleteColaboradorDialogOpen(true);
  };

  const confirmDeleteColaborador = async () => {
    if (colaboradorToDelete?.id) {
      try {
        await deleteColaborador(colaboradorToDelete.id);
        await loadColaboradores(); // Reload the list
        if (colaboradores.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir colaborador:", error);
      } finally {
        setDeleteColaboradorDialogOpen(false);
        setColaboradorToDelete(null);
      }
    }
  };

  const handleColaboradorSubmit = async (colaboradorData: any) => {
    let tempId: number | null = null;
    
    try {
      setIsSubmitting(true);
      console.log("💾 Submitting colaborador data:", colaboradorData);
      
      const isEditing = colaboradorData.id;
      
      if (isEditing) {
        console.log("📝 Updating existing colaborador with ID:", colaboradorData.id);
        const result = await updateColaborador(colaboradorData);
        
        // Extract the actual colaborador data from the API response
        const updatedColaborador = result.data || result;
        console.log("✅ Colaborador update successful:", updatedColaborador);
        
        // Update the colaborador in the list
        updateOptimisticColaborador(updatedColaborador);
        
      } else {
        console.log("➕ Creating new colaborador...");
        
        // Find the selected direction, management, coordination for better optimistic UI
        let selectedDirection = null;
        let selectedManagement = null;
        let selectedCoordination = null;
        
        if (colaboradorData.direction) {
          try {
            const directions = await fetchDirections();
            selectedDirection = directions.find((dir: any) => dir.id === colaboradorData.direction);
          } catch (error) {
            console.warn("Could not fetch directions for optimistic UI");
          }
        }
        
        if (colaboradorData.management) {
          try {
            const managements = await fetchManagements();
            selectedManagement = managements.find((mgmt: any) => mgmt.id === colaboradorData.management);
          } catch (error) {
            console.warn("Could not fetch managements for optimistic UI");
          }
        }
        
        if (colaboradorData.coordination) {
          try {
            const coordinations = await fetchCoordinations();
            selectedCoordination = coordinations.find((coord: any) => coord.id === colaboradorData.coordination);
          } catch (error) {
            console.warn("Could not fetch coordinations for optimistic UI");
          }
        }
        
        // Add optimistic entry for immediate UI feedback
        tempId = addOptimisticColaborador({
          ...colaboradorData,
          direction: selectedDirection,
          management: selectedManagement,
          coordination: selectedCoordination
        });
        
        // Make the API call
        const result = await createColaborador(colaboradorData);
        
        // Extract the actual colaborador data from the API response
        const newColaborador = result.data || result;
        console.log("✅ Colaborador creation successful:", newColaborador);
        
        // Replace optimistic entry with real data
        replaceOptimisticColaborador(tempId, newColaborador);
      }
      
      // Close form
      setColaboradorFormOpen(false);
      setEditingColaborador(null);
      
      console.log("✅ Colaborador operation completed successfully");
      
    } catch (error) {
      console.error("❌ Erro ao salvar colaborador:", error);
      
      // If this was a creation and we have a temporary ID, remove the optimistic entry
      if (!colaboradorData.id && tempId !== null) {
        removeOptimisticColaborador(tempId);
      }
      
      // Handle error - show user notification here if needed
      // For now, we'll keep the form open so user can try again
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-1 px-2">
      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={colaboradores}
          title="Colaboradores"
          pageSize={pageSize}
          pageIndex={page - 1}
          totalCount={totalColaboradores}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1);
          }}
          onAdd={handleAddColaborador}
          onEdit={handleEditColaborador}
          onDelete={handleDeleteColaborador}
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

        <ColaboradorForm
          open={colaboradorFormOpen}
          handleClose={() => {
            setColaboradorFormOpen(false);
            setEditingColaborador(null);
          }}
          initialData={editingColaborador}
          onSubmit={handleColaboradorSubmit}
          isSubmitting={isSubmitting}
        />

        <AlertDialog
          open={deleteColaboradorDialogOpen}
          onOpenChange={setDeleteColaboradorDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o colaborador{" "}
                <strong>{colaboradorToDelete?.full_name}</strong>?
                {colaboradorToDelete?.cpf && (
                  <> (CPF: {colaboradorToDelete.cpf})</>
                )}
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteColaborador}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}