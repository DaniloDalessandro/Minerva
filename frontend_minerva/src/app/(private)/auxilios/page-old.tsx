"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { AuxilioForm, auxilioColumns, useOptimisticAuxilios, type Auxilio } from "@/features/auxilios";
import { AuxilioService, ColaboradorService, BudgetLineService } from "@/services";
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

export default function AuxiliosPage() {
  // Hook de auxílios otimista para melhor gerenciamento de estado
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

  // Estados de paginação e filtro
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Estados do formulário
  const [auxilioFormOpen, setAuxilioFormOpen] = useState(false);
  const [editingAuxilio, setEditingAuxilio] = useState<Auxilio | null>(null);
  
  // Estados do diálogo de exclusão
  const [deleteAuxilioDialogOpen, setDeleteAuxilioDialogOpen] = useState(false);
  const [auxilioToDelete, setAuxilioToDelete] = useState<Auxilio | null>(null);
  
  // Estados de carregamento
  const [isSubmitting, setIsSubmitting] = useState(false);


  const convertSortingToOrdering = (sorting: { id: string; desc: boolean }[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  };

  // Função para carregar auxílios
  const loadAuxilios = useCallback(async () => {
    try {
      setLoading(true);
      
      const ordering = convertSortingToOrdering(sorting);
      
      const filterValues = Object.values(filters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : search;
      
      const data = await AuxilioService.fetchAuxilios(page, pageSize, searchParam, ordering);
      setAuxilios(data.results);
      setTotalCount(data.count);
    } catch (error) {
      console.error("❌ Erro ao carregar auxílios:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, sorting, filters, setAuxilios, setTotalCount, setLoading]);

  useEffect(() => {
    loadAuxilios();
  }, [loadAuxilios]);

  // Registra a função de atualização para a AppSidebar
  useRegisterRefresh('auxilios', loadAuxilios);

  // Verifica o modo de edição a partir do session storage (ao voltar da página de detalhes)
  useEffect(() => {
    const editAuxilioId = window.sessionStorage.getItem('editAuxilioId');
    if (editAuxilioId) {
      window.sessionStorage.removeItem('editAuxilioId');
      const auxilioToEdit = auxilios.find(a => a.id.toString() === editAuxilioId);
      if (auxilioToEdit) {
        setEditingAuxilio(auxilioToEdit);
        setAuxilioFormOpen(true);
      }
    }
  }, [auxilios]);

  const handleViewDetails = (auxilio: Auxilio) => {
    // Abre os detalhes do auxílio em uma nova aba
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
        await AuxilioService.deleteAuxilio(auxilioToDelete.id);
        await loadAuxilios(); // Recarrega a lista
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
      
      const isEditing = auxilioData.id;
      
      if (isEditing) {
        const updatedAuxilio = await AuxilioService.updateAuxilio(auxilioData);
        updateOptimisticAuxilio(updatedAuxilio);
        
      } else {
        
        let selectedEmployee = null;
        let selectedBudgetLine = null;
        
        if (auxilioData.employee) {
          try {
            const data = await ColaboradorService.fetchColaboradores(1, 1000);
            selectedEmployee = data.results.find((emp: any) => emp.id === auxilioData.employee);
          } catch (error) {
          }
        }

        if (auxilioData.budget_line) {
          try {
            const data = await BudgetLineService.fetchBudgetLines(1, 1000);
            selectedBudgetLine = data.results.find((bl: any) => bl.id === auxilioData.budget_line);
          } catch (error) {
          }
        }
        
        tempId = addOptimisticAuxilio({
          ...auxilioData,
          employee: selectedEmployee,
          budget_line: selectedBudgetLine
        });
        
        const newAuxilio = await AuxilioService.createAuxilio(auxilioData);

        if (tempId !== null) {
          replaceOptimisticAuxilio(tempId, newAuxilio);
        }
      }
      
      setAuxilioFormOpen(false);
      setEditingAuxilio(null);
      
    } catch (error) {
      console.error("❌ Erro ao salvar auxílio:", error);
      
      if (!auxilioData.id && tempId !== null) {
        removeOptimisticAuxilio(tempId);
      }
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-1">
      <div className="space-y-2">
        <DataTable
          columns={auxilioColumns}
          data={auxilios}
          title="Auxílios"
          subtitle="Gerenciamento de auxílios aos colaboradores"
          pageSize={pageSize}
          pageIndex={page - 1}
          totalCount={totalAuxilios}
          onPageChange={(newPageIndex: number) => setPage(newPageIndex + 1)}
          onPageSizeChange={(newPageSize: number) => {
            setPageSize(newPageSize);
            setPage(1);
          }}
          onAdd={handleAddAuxilio}
          onEdit={handleEditAuxilio}
          onDelete={handleDeleteAuxilio}
          onViewDetails={handleViewDetails}
          onFilterChange={(columnId: string, value: string) => {
            const newFilters = { ...filters };
            if (value) {
              newFilters[columnId] = value;
            } else {
              delete newFilters[columnId];
            }
            setFilters(newFilters);
            setPage(1);
          }}
          onSortingChange={(newSorting: any) => {
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