"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ManagementCenterForm,
  RequestingCenterForm,
  managementCenterColumns,
  requestingCenterColumns,
  type ManagementCenter,
  type RequestingCenter
} from "@/features/centro";
import { CenterService } from "@/services";
import { DataTable } from "@/components/ui/data-table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CentrosPage() {
  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState("management-centers");
  
  // Estados para Centros Gestores
  const [managementCenters, setManagementCenters] = useState<ManagementCenter[]>([]);
  const [totalManagementCenters, setTotalManagementCenters] = useState(0);
  const [managementCenterPage, setManagementCenterPage] = useState(1);
  const [managementCenterPageSize, setManagementCenterPageSize] = useState(10);
  const [managementCenterSearch, setManagementCenterSearch] = useState("");
  const [managementCenterSorting, setManagementCenterSorting] = useState([]);
  const [managementCenterFilters, setManagementCenterFilters] = useState<Record<string, string>>({});
  const [managementCenterStatusFilter, setManagementCenterStatusFilter] = useState("active");
  const [openManagementCenterForm, setOpenManagementCenterForm] = useState(false);
  const [editingManagementCenter, setEditingManagementCenter] = useState<ManagementCenter | null>(
    null
  );
  const [deleteManagementCenterDialogOpen, setDeleteManagementCenterDialogOpen] =
    useState(false);
  const [managementCenterToDelete, setManagementCenterToDelete] = useState<ManagementCenter | null>(
    null
  );

  // Estados para Centros Solicitantes
  const [requestingCenters, setRequestingCenters] = useState<RequestingCenter[]>([]);
  const [totalRequestingCenters, setTotalRequestingCenters] = useState(0);
  const [requestingCenterPage, setRequestingCenterPage] = useState(1);
  const [requestingCenterPageSize, setRequestingCenterPageSize] = useState(10);
  const [requestingCenterSearch, setRequestingCenterSearch] = useState("");
  const [requestingCenterSorting, setRequestingCenterSorting] = useState([]);
  const [requestingCenterFilters, setRequestingCenterFilters] = useState<Record<string, string>>({});
  const [requestingCenterStatusFilter, setRequestingCenterStatusFilter] = useState("active");
  const [openRequestingCenterForm, setOpenRequestingCenterForm] = useState(false);
  const [editingRequestingCenter, setEditingRequestingCenter] =
    useState<RequestingCenter | null>(null);
  const [deleteRequestingCenterDialogOpen, setDeleteRequestingCenterDialogOpen] =
    useState(false);
  const [requestingCenterToDelete, setRequestingCenterToDelete] =
    useState<RequestingCenter | null>(null);

  const convertSortingToOrdering = (sorting: any[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  };

  // Funções de carregamento
  const loadManagementCenters = useCallback(async () => {
    try {
      const ordering = convertSortingToOrdering(managementCenterSorting);

      const filterValues = Object.values(managementCenterFilters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : managementCenterSearch;

      const data = await CenterService.fetchManagementCenters(
        managementCenterPage,
        managementCenterPageSize,
        searchParam,
        ordering,
        managementCenterStatusFilter
      );
      setManagementCenters(data.results);
      setTotalManagementCenters(data.count);
    } catch (error) {
      console.error("Erro ao carregar centros gestores:", error);
    }
  }, [managementCenterPage, managementCenterPageSize, managementCenterSearch, managementCenterSorting, managementCenterFilters, managementCenterStatusFilter]);

  const loadRequestingCenters = useCallback(async () => {
    try {
      const ordering = convertSortingToOrdering(requestingCenterSorting);

      const filterValues = Object.values(requestingCenterFilters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : requestingCenterSearch;

      const data = await CenterService.fetchRequestingCenters(
        requestingCenterPage,
        requestingCenterPageSize,
        searchParam,
        ordering,
        requestingCenterStatusFilter
      );
      setRequestingCenters(data.results);
      setTotalRequestingCenters(data.count);
    } catch (error) {
      console.error("Erro ao carregar centros solicitantes:", error);
    }
  }, [requestingCenterPage, requestingCenterPageSize, requestingCenterSearch, requestingCenterSorting, requestingCenterFilters, requestingCenterStatusFilter]);

  useEffect(() => {
    loadManagementCenters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managementCenterPage, managementCenterPageSize, managementCenterSearch, managementCenterSorting, managementCenterFilters, managementCenterStatusFilter]);

  useEffect(() => {
    loadRequestingCenters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestingCenterPage, requestingCenterPageSize, requestingCenterSearch, requestingCenterSorting, requestingCenterFilters, requestingCenterStatusFilter]);

  // Cria uma função de carregamento combinada para os centros
  const loadCenters = useCallback(async () => {
    await Promise.all([loadManagementCenters(), loadRequestingCenters()]);
  }, [loadManagementCenters, loadRequestingCenters]);

  useRegisterRefresh('centros', loadCenters);

  // Manipuladores de exclusão
  const handleDeleteManagementCenter = async () => {
    if (managementCenterToDelete?.id) {
      try {
        await CenterService.deleteManagementCenter(managementCenterToDelete.id);
        await loadManagementCenters();
        if (managementCenters.length === 1 && managementCenterPage > 1) {
          setManagementCenterPage(managementCenterPage - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir centro gestor:", error);
      } finally {
        setDeleteManagementCenterDialogOpen(false);
        setManagementCenterToDelete(null);
      }
    }
  };

  const handleDeleteRequestingCenter = async () => {
    if (requestingCenterToDelete?.id) {
      try {
        await CenterService.deleteRequestingCenter(requestingCenterToDelete.id);
        await loadRequestingCenters();
        if (requestingCenters.length === 1 && requestingCenterPage > 1) {
          setRequestingCenterPage(requestingCenterPage - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir centro solicitante:", error);
      } finally {
        setDeleteRequestingCenterDialogOpen(false);
        setRequestingCenterToDelete(null);
      }
    }
  };

  // Função para obter o título da aba atual
  const getCurrentTabTitle = () => {
    switch (activeTab) {
      case "management-centers":
        return "Centros Gestores";
      case "requesting-centers":
        return "Centros Solicitantes";
      default:
        return "Centros";
    }
  };

  return (
    <div className="w-full py-1">
      <Tabs defaultValue="management-centers" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 gap-2 bg-muted p-1 h-auto">
          <TabsTrigger 
            value="management-centers" 
            className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-200 
                       bg-background text-muted-foreground rounded-md border border-transparent
                       hover:bg-accent hover:text-accent-foreground
                       data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 
                       data-[state=active]:border-blue-200 data-[state=active]:shadow-sm"
          >
            Centros Gestores
          </TabsTrigger>
          <TabsTrigger 
            value="requesting-centers" 
            className="flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-200 
                       bg-background text-muted-foreground rounded-md border border-transparent
                       hover:bg-accent hover:text-accent-foreground
                       data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 
                       data-[state=active]:border-blue-200 data-[state=active]:shadow-sm"
          >
            Centros Solicitantes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="management-centers">
          <DataTable
            columns={managementCenterColumns()}
            data={managementCenters}
            title={getCurrentTabTitle()}
            subtitle="Gerenciamento de centros gestores"
            pageSize={managementCenterPageSize}
            pageIndex={managementCenterPage - 1}
            totalCount={totalManagementCenters}
            initialFilters={[{ id: "is_active", value: managementCenterStatusFilter }] as any}
            onPageChange={(newPageIndex: number) => setManagementCenterPage(newPageIndex + 1)}
            onViewDetails={() => {}}
            onPageSizeChange={(newPageSize: number) => {
              setManagementCenterPageSize(newPageSize);
              setManagementCenterPage(1);
            }}
            onAdd={() => {
              setEditingManagementCenter(null);
              setOpenManagementCenterForm(true);
            }}
            onEdit={(item: any) => {
              setEditingManagementCenter(item);
              setOpenManagementCenterForm(true);
            }}
            onDelete={(item: any) => {
              setManagementCenterToDelete(item);
              setDeleteManagementCenterDialogOpen(true);
            }}
            onFilterChange={(columnId: string, value: string) => {
              if (columnId === "is_active") {
                setManagementCenterStatusFilter(value);
                setManagementCenterPage(1);
              } else {
                const newFilters = { ...managementCenterFilters };
                if (value && value !== 'all' && value !== 'ALL') {
                  newFilters[columnId] = value;
                } else {
                  delete newFilters[columnId];
                }
                setManagementCenterFilters(newFilters);
                setManagementCenterPage(1);
              }
            }}
            onSortingChange={(newSorting: any) => {
              setManagementCenterSorting(newSorting);
              setManagementCenterPage(1);
            }}
          />
        </TabsContent>
        <TabsContent value="requesting-centers">
          <DataTable
            columns={requestingCenterColumns()}
            data={requestingCenters}
            title={getCurrentTabTitle()}
            subtitle="Gerenciamento de centros solicitantes"
            pageSize={requestingCenterPageSize}
            pageIndex={requestingCenterPage - 1}
            totalCount={totalRequestingCenters}
            initialFilters={[{ id: "is_active", value: requestingCenterStatusFilter }] as any}
            onPageChange={(newPageIndex: number) =>
              setRequestingCenterPage(newPageIndex + 1)
            }
            onViewDetails={() => {}}
            onPageSizeChange={(newPageSize: number) => {
              setRequestingCenterPageSize(newPageSize);
              setRequestingCenterPage(1);
            }}
            onAdd={() => {
              setEditingRequestingCenter(null);
              setOpenRequestingCenterForm(true);
            }}
            onEdit={(item: any) => {
              setEditingRequestingCenter(item);
              setOpenRequestingCenterForm(true);
            }}
            onDelete={(item: any) => {
              setRequestingCenterToDelete(item);
              setDeleteRequestingCenterDialogOpen(true);
            }}
            onFilterChange={(columnId: string, value: string) => {
              if (columnId === "is_active") {
                setRequestingCenterStatusFilter(value);
                setRequestingCenterPage(1);
              } else {
                const newFilters = { ...requestingCenterFilters };
                if (value && value !== 'all' && value !== 'ALL') {
                  newFilters[columnId] = value;
                } else {
                  delete newFilters[columnId];
                }
                setRequestingCenterFilters(newFilters);
                setRequestingCenterPage(1);
              }
            }}
            onSortingChange={(newSorting: any) => {
              setRequestingCenterSorting(newSorting);
              setRequestingCenterPage(1);
            }}
          />
        </TabsContent>
      </Tabs>

      <ManagementCenterForm
        open={openManagementCenterForm}
        handleClose={() => setOpenManagementCenterForm(false)}
        initialData={editingManagementCenter}
        existingNames={managementCenters.map(center => center.name)}
        onSubmit={async (data) => {
          try {
            if (data.id) {
              await CenterService.updateManagementCenter(data);
            } else {
              await CenterService.createManagementCenter(data);
            }
            await loadManagementCenters();
            setOpenManagementCenterForm(false);
          } catch (error) {
            console.error("Erro ao salvar centro gestor:", error);
          }
        }}
      />
      <AlertDialog
        open={deleteManagementCenterDialogOpen}
        onOpenChange={setDeleteManagementCenterDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar inativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja inativar o centro gestor "
              {managementCenterToDelete?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteManagementCenter}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RequestingCenterForm
        open={openRequestingCenterForm}
        handleClose={() => setOpenRequestingCenterForm(false)}
        initialData={editingRequestingCenter}
        existingNames={requestingCenters
          .filter(center => !editingRequestingCenter || center.management_center.id === editingRequestingCenter.management_center.id)
          .map(center => center.name)}
        onSubmit={async (data) => {
          try {
            if (data.id) {
              await CenterService.updateRequestingCenter(data);
            } else {
              await CenterService.createRequestingCenter(data);
            }
            await loadRequestingCenters();
            setOpenRequestingCenterForm(false);
          } catch (error) {
            console.error("Erro ao salvar centro solicitante:", error);
          }
        }}
      />
      <AlertDialog
        open={deleteRequestingCenterDialogOpen}
        onOpenChange={setDeleteRequestingCenterDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar inativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja inativar o centro solicitante "
              {requestingCenterToDelete?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRequestingCenter}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}