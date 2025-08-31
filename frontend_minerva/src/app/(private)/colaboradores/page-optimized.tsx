"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { fetchColaboradores, Colaborador, createColaborador, updateColaborador, deleteColaborador } from "@/lib/api/colaboradores";
import { fetchDirections, fetchManagements, fetchCoordinations } from "@/lib/api/colaboradores";
import ColaboradorForm from "@/components/forms/ColaboradorForm";
import { useOptimisticColaboradores } from "@/hooks/useOptimisticColaboradores";
import { useDebounceCallback, useDebouncedApiCall } from "@/hooks/useDebounce-enhanced";
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

// Interface para estado consolidado
interface PageState {
  page: number;
  pageSize: number;
  search: string;
  sorting: any[];
  filters: Record<string, string>;
}

// Interface para estados de UI
interface UIState {
  colaboradorFormOpen: boolean;
  editingColaborador: Colaborador | null;
  deleteColaboradorDialogOpen: boolean;
  colaboradorToDelete: Colaborador | null;
  isSubmitting: boolean;
}

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

  // Estado consolidado para paginação e filtros
  const [pageState, setPageState] = useState<PageState>({
    page: 1,
    pageSize: 10,
    search: "",
    sorting: [],
    filters: {}
  });

  // Estado consolidado para UI
  const [uiState, setUIState] = useState<UIState>({
    colaboradorFormOpen: false,
    editingColaborador: null,
    deleteColaboradorDialogOpen: false,
    colaboradorToDelete: null,
    isSubmitting: false
  });

  // Cache para dropdown options
  const [dropdownCache, setDropdownCache] = useState<{
    directions: any[] | null;
    managements: any[] | null;
    coordinations: any[] | null;
  }>({
    directions: null,
    managements: null,
    coordinations: null
  });

  // Memoize a função de conversão de ordenação
  const convertSortingToOrdering = useMemo(() => 
    (sorting: { id: string; desc: boolean }[]) => {
      if (!sorting || sorting.length === 0) return "";
      const sortItem = sorting[0];
      const prefix = sortItem.desc ? "-" : "";
      return `${prefix}${sortItem.id}`;
    }, []
  );

  // Debounced API call para carregamento de colaboradores
  const {
    call: loadColaboradores,
    isLoading: isApiLoading,
    error: apiError
  } = useDebouncedApiCall(async (state: PageState) => {
    console.log("🔄 Loading colaboradores with params:", state);
    
    const ordering = convertSortingToOrdering(state.sorting);
    
    // Build search params including filters
    const filterValues = Object.values(state.filters).filter(Boolean);
    const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : state.search;
    
    const data = await fetchColaboradores(state.page, state.pageSize, searchParam, ordering);
    return data;
  }, 300);

  // Função para carregar dropdown options apenas quando necessário
  const loadDropdownOptions = useCallback(async () => {
    const promises = [];
    
    if (!dropdownCache.directions) {
      promises.push(
        fetchDirections().then(data => ({ type: 'directions', data }))
      );
    }
    
    if (!dropdownCache.managements) {
      promises.push(
        fetchManagements().then(data => ({ type: 'managements', data }))
      );
    }
    
    if (!dropdownCache.coordinations) {
      promises.push(
        fetchCoordinations().then(data => ({ type: 'coordinations', data }))
      );
    }

    if (promises.length > 0) {
      const results = await Promise.all(promises);
      
      setDropdownCache(prev => {
        const newCache = { ...prev };
        results.forEach(result => {
          newCache[result.type as keyof typeof newCache] = result.data;
        });
        return newCache;
      });
    }
  }, [dropdownCache.directions, dropdownCache.managements, dropdownCache.coordinations]);

  // Efeito para carregar colaboradores quando o estado da página muda
  useEffect(() => {
    loadColaboradores(pageState).then(data => {
      if (data) {
        setColaboradores(data.results);
        setTotalCount(data.count);
        console.log("✅ Colaboradores loaded successfully:", data.results.length, "items");
      }
    }).catch(error => {
      console.error("❌ Erro ao carregar colaboradores:", error);
    });
  }, [pageState, loadColaboradores, setColaboradores, setTotalCount]);

  // Check for edit mode from session storage (when coming back from details page)
  useEffect(() => {
    const editColaboradorId = window.sessionStorage.getItem('editColaboradorId');
    if (editColaboradorId) {
      window.sessionStorage.removeItem('editColaboradorId');
      const colaboradorToEdit = colaboradores.find(c => c.id.toString() === editColaboradorId);
      if (colaboradorToEdit) {
        setUIState(prev => ({
          ...prev,
          editingColaborador: colaboradorToEdit,
          colaboradorFormOpen: true
        }));
      }
    }
  }, [colaboradores]);

  // Handlers otimizados usando useCallback
  const handleViewDetails = useCallback((colaborador: Colaborador) => {
    window.open(`/colaboradores/${colaborador.id}`, '_blank');
  }, []);

  const handleAddColaborador = useCallback(async () => {
    await loadDropdownOptions(); // Carrega options apenas quando necessário
    setUIState(prev => ({
      ...prev,
      editingColaborador: null,
      colaboradorFormOpen: true
    }));
  }, [loadDropdownOptions]);

  const handleEditColaborador = useCallback(async (colaborador: Colaborador) => {
    await loadDropdownOptions(); // Carrega options apenas quando necessário
    setUIState(prev => ({
      ...prev,
      editingColaborador: colaborador,
      colaboradorFormOpen: true
    }));
  }, [loadDropdownOptions]);

  const handleDeleteColaborador = useCallback((colaborador: Colaborador) => {
    setUIState(prev => ({
      ...prev,
      colaboradorToDelete: colaborador,
      deleteColaboradorDialogOpen: true
    }));
  }, []);

  // Debounced handlers para mudanças de filtro
  const debouncedFilterChange = useDebounceCallback((columnId: string, value: string) => {
    setPageState(prev => {
      const newFilters = { ...prev.filters };
      if (value) {
        newFilters[columnId] = value;
      } else {
        delete newFilters[columnId];
      }
      return {
        ...prev,
        filters: newFilters,
        page: 1
      };
    });
  }, 300, []);

  const confirmDeleteColaborador = useCallback(async () => {
    if (uiState.colaboradorToDelete?.id) {
      try {
        await deleteColaborador(uiState.colaboradorToDelete.id);
        await loadColaboradores(pageState);
        
        if (colaboradores.length === 1 && pageState.page > 1) {
          setPageState(prev => ({ ...prev, page: prev.page - 1 }));
        }
      } catch (error) {
        console.error("Erro ao excluir colaborador:", error);
      } finally {
        setUIState(prev => ({
          ...prev,
          deleteColaboradorDialogOpen: false,
          colaboradorToDelete: null
        }));
      }
    }
  }, [uiState.colaboradorToDelete, loadColaboradores, pageState, colaboradores.length]);

  const handleColaboradorSubmit = useCallback(async (colaboradorData: any) => {
    let tempId: number | null = null;
    
    try {
      setUIState(prev => ({ ...prev, isSubmitting: true }));
      console.log("💾 Submitting colaborador data:", colaboradorData);
      
      const isEditing = colaboradorData.id;
      
      if (isEditing) {
        console.log("📝 Updating existing colaborador with ID:", colaboradorData.id);
        const result = await updateColaborador(colaboradorData);
        
        const updatedColaborador = result.data || result;
        console.log("✅ Colaborador update successful:", updatedColaborador);
        
        updateOptimisticColaborador(updatedColaborador);
        
      } else {
        console.log("➕ Creating new colaborador...");
        
        // Use cached dropdown data for better optimistic UI
        let selectedDirection = null;
        let selectedManagement = null;
        let selectedCoordination = null;
        
        if (colaboradorData.direction && dropdownCache.directions) {
          selectedDirection = dropdownCache.directions.find((dir: any) => dir.id === colaboradorData.direction);
        }
        
        if (colaboradorData.management && dropdownCache.managements) {
          selectedManagement = dropdownCache.managements.find((mgmt: any) => mgmt.id === colaboradorData.management);
        }
        
        if (colaboradorData.coordination && dropdownCache.coordinations) {
          selectedCoordination = dropdownCache.coordinations.find((coord: any) => coord.id === colaboradorData.coordination);
        }
        
        // Add optimistic entry
        tempId = addOptimisticColaborador({
          ...colaboradorData,
          direction: selectedDirection,
          management: selectedManagement,
          coordination: selectedCoordination
        });
        
        const result = await createColaborador(colaboradorData);
        const newColaborador = result.data || result;
        console.log("✅ Colaborador creation successful:", newColaborador);
        
        replaceOptimisticColaborador(tempId, newColaborador);
      }
      
      setUIState(prev => ({
        ...prev,
        colaboradorFormOpen: false,
        editingColaborador: null
      }));
      
      console.log("✅ Colaborador operation completed successfully");
      
    } catch (error) {
      console.error("❌ Erro ao salvar colaborador:", error);
      
      if (!colaboradorData.id && tempId !== null) {
        removeOptimisticColaborador(tempId);
      }
      
    } finally {
      setUIState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [dropdownCache, addOptimisticColaborador, replaceOptimisticColaborador, removeOptimisticColaborador, updateOptimisticColaborador]);

  return (
    <div className="container mx-auto py-1 px-2">
      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={colaboradores}
          title="Colaboradores"
          pageSize={pageState.pageSize}
          pageIndex={pageState.page - 1}
          totalCount={totalColaboradores}
          onPageChange={(newPageIndex) => setPageState(prev => ({ ...prev, page: newPageIndex + 1 }))}
          onPageSizeChange={(newPageSize) => {
            setPageState(prev => ({
              ...prev,
              pageSize: newPageSize,
              page: 1
            }));
          }}
          onAdd={handleAddColaborador}
          onEdit={handleEditColaborador}
          onDelete={handleDeleteColaborador}
          onViewDetails={handleViewDetails}
          onFilterChange={debouncedFilterChange}
          onSortingChange={(newSorting) => {
            setPageState(prev => ({
              ...prev,
              sorting: newSorting,
              page: 1
            }));
          }}
        />

        <ColaboradorForm
          open={uiState.colaboradorFormOpen}
          handleClose={() => {
            setUIState(prev => ({
              ...prev,
              colaboradorFormOpen: false,
              editingColaborador: null
            }));
          }}
          initialData={uiState.editingColaborador}
          onSubmit={handleColaboradorSubmit}
          isSubmitting={uiState.isSubmitting}
        />

        <AlertDialog
          open={uiState.deleteColaboradorDialogOpen}
          onOpenChange={(open) => setUIState(prev => ({ ...prev, deleteColaboradorDialogOpen: open }))}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o colaborador{" "}
                <strong>{uiState.colaboradorToDelete?.full_name}</strong>?
                {uiState.colaboradorToDelete?.cpf && (
                  <> (CPF: {uiState.colaboradorToDelete.cpf})</>
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