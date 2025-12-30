"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  fetchManagementCenters,
  createManagementCenter,
  updateManagementCenter,
  deleteManagementCenter,
  ManagementCenter,
} from "@/lib/api/centers";
import {
  fetchRequestingCenters,
  createRequestingCenter,
  updateRequestingCenter,
  deleteRequestingCenter,
  RequestingCenter,
} from "@/lib/api/centers";

import ManagementCenterForm from "@/components/forms/ManagementCenterForm";
import RequestingCenterForm from "@/components/forms/RequestingCenterForm";
import { DataTable } from "@/components/ui/data-table";
import { columns as managementCenterColumns } from "./columns/management-centers";
import { columns as requestingCenterColumns } from "./columns/requesting-centers";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CentrosPage() {
  // Active tab state
  const [activeTab, setActiveTab] = useState("management-centers");
  
  // States for Management Centers
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

  // States for Requesting Centers
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

  // Load functions
  const loadManagementCenters = useCallback(async () => {
    try {
      console.log('🔄 [LOAD] Loading Management Centers with params:', {
        page: managementCenterPage,
        pageSize: managementCenterPageSize,
        search: managementCenterSearch,
        filters: managementCenterFilters,
        statusFilter: managementCenterStatusFilter
      });
      console.log('🔄 [LOAD] Filters object keys:', Object.keys(managementCenterFilters));
      console.log('🔄 [LOAD] Filters object values:', Object.values(managementCenterFilters));
      const ordering = convertSortingToOrdering(managementCenterSorting);

      // Build search params including filters - use the most recent filter value
      const filterValues = Object.values(managementCenterFilters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : managementCenterSearch;

      console.log('🔍 Search Logic:', {
        filterValues,
        managementCenterSearch,
        finalSearchParam: searchParam
      });

      const data = await fetchManagementCenters(
        managementCenterPage,
        managementCenterPageSize,
        searchParam,
        ordering,
        managementCenterStatusFilter
      );
      console.log('✅ Management Centers loaded:', data.count, 'results:', data.results.length);
      setManagementCenters(data.results);
      setTotalManagementCenters(data.count);
    } catch (error) {
      console.error("Erro ao carregar centros gestores:", error);
    }
  }, [managementCenterPage, managementCenterPageSize, managementCenterSearch, managementCenterSorting, managementCenterFilters, managementCenterStatusFilter]);

  const loadRequestingCenters = useCallback(async () => {
    try {
      console.log('🔄 Loading Requesting Centers with params:', {
        page: requestingCenterPage,
        pageSize: requestingCenterPageSize,
        search: requestingCenterSearch,
        filters: requestingCenterFilters,
        statusFilter: requestingCenterStatusFilter
      });
      const ordering = convertSortingToOrdering(requestingCenterSorting);

      // Build search params including filters - use the most recent filter value
      const filterValues = Object.values(requestingCenterFilters).filter(Boolean);
      const searchParam = filterValues.length > 0 ? filterValues[filterValues.length - 1] : requestingCenterSearch;

      const data = await fetchRequestingCenters(
        requestingCenterPage,
        requestingCenterPageSize,
        searchParam,
        ordering,
        requestingCenterStatusFilter
      );
      console.log('✅ Requesting Centers loaded:', data.count, 'results:', data.results.length);
      setRequestingCenters(data.results);
      setTotalRequestingCenters(data.count);
    } catch (error) {
      console.error("Erro ao carregar centros solicitantes:", error);
    }
  }, [requestingCenterPage, requestingCenterPageSize, requestingCenterSearch, requestingCenterSorting, requestingCenterFilters, requestingCenterStatusFilter]);

  useEffect(() => {
    console.log('🔥 [EFFECT] Management Centers useEffect triggered!');
    loadManagementCenters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managementCenterPage, managementCenterPageSize, managementCenterSearch, managementCenterSorting, managementCenterFilters, managementCenterStatusFilter]);

  useEffect(() => {
    console.log('🔥 [EFFECT] Requesting Centers useEffect triggered!');
    loadRequestingCenters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestingCenterPage, requestingCenterPageSize, requestingCenterSearch, requestingCenterSorting, requestingCenterFilters, requestingCenterStatusFilter]);

  // Create a combined load function for centers
  const loadCenters = useCallback(async () => {
    await Promise.all([loadManagementCenters(), loadRequestingCenters()]);
  }, [loadManagementCenters, loadRequestingCenters]);

  useRegisterRefresh('centros', loadCenters);

  // Delete handlers
  const handleDeleteManagementCenter = async () => {
    if (managementCenterToDelete?.id) {
      try {
        await deleteManagementCenter(managementCenterToDelete.id);
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
        await deleteRequestingCenter(requestingCenterToDelete.id);
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

  // Function to get current tab title
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
            pageSize={managementCenterPageSize}
            pageIndex={managementCenterPage - 1}
            totalCount={totalManagementCenters}
            initialFilters={[{ id: "is_active", value: managementCenterStatusFilter }]}
            onPageChange={(newPageIndex) => setManagementCenterPage(newPageIndex + 1)}
            onPageSizeChange={(newPageSize) => {
              console.log('📏 Management Center PageSize changed to:', newPageSize);
              setManagementCenterPageSize(newPageSize);
              setManagementCenterPage(1);
            }}
            onAdd={() => {
              setEditingManagementCenter(null);
              setOpenManagementCenterForm(true);
            }}
            onEdit={(item) => {
              setEditingManagementCenter(item);
              setOpenManagementCenterForm(true);
            }}
            onDelete={(item) => {
              setManagementCenterToDelete(item);
              setDeleteManagementCenterDialogOpen(true);
            }}
            onFilterChange={(columnId, value) => {
              console.log('🔍 [PAGE] Management Center Filter changed:', { columnId, value });
              if (columnId === "is_active") {
                console.log('📊 [PAGE] Setting status filter to:', value);
                setManagementCenterStatusFilter(value);
                setManagementCenterPage(1);
              } else {
                // Para outros filtros (como nome), usar o sistema de filtros
                console.log('📝 [PAGE] Processing filter for column:', columnId, 'value:', value);
                const newFilters = { ...managementCenterFilters };
                if (value && value !== 'all' && value !== 'ALL') {
                  newFilters[columnId] = value;
                  console.log('✅ [PAGE] Adding filter:', newFilters);
                } else {
                  delete newFilters[columnId];
                  console.log('❌ [PAGE] Removing filter:', newFilters);
                }
                console.log('📦 [PAGE] Setting new filters:', newFilters);
                setManagementCenterFilters(newFilters);
                setManagementCenterPage(1);
                console.log('🔄 [PAGE] Page reset to 1');
              }
            }}
            onSortingChange={(newSorting) => {
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
            pageSize={requestingCenterPageSize}
            pageIndex={requestingCenterPage - 1}
            totalCount={totalRequestingCenters}
            initialFilters={[{ id: "is_active", value: requestingCenterStatusFilter }]}
            onPageChange={(newPageIndex) =>
              setRequestingCenterPage(newPageIndex + 1)
            }
            onPageSizeChange={(newPageSize) => {
              console.log('📏 Requesting Center PageSize changed to:', newPageSize);
              setRequestingCenterPageSize(newPageSize);
              setRequestingCenterPage(1);
            }}
            onAdd={() => {
              setEditingRequestingCenter(null);
              setOpenRequestingCenterForm(true);
            }}
            onEdit={(item) => {
              setEditingRequestingCenter(item);
              setOpenRequestingCenterForm(true);
            }}
            onDelete={(item) => {
              setRequestingCenterToDelete(item);
              setDeleteRequestingCenterDialogOpen(true);
            }}
            onFilterChange={(columnId, value) => {
              console.log('🔍 Requesting Center Filter changed:', { columnId, value });
              if (columnId === "is_active") {
                console.log('📊 Setting status filter to:', value);
                setRequestingCenterStatusFilter(value);
                setRequestingCenterPage(1);
              } else {
                // Para outros filtros (como nome), usar o sistema de filtros
                const newFilters = { ...requestingCenterFilters };
                if (value && value !== 'all' && value !== 'ALL') {
                  newFilters[columnId] = value;
                } else {
                  delete newFilters[columnId];
                }
                console.log('📝 Setting filters to:', newFilters);
                setRequestingCenterFilters(newFilters);
                setRequestingCenterPage(1);
              }
            }}
            onSortingChange={(newSorting) => {
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
              await updateManagementCenter(data);
            } else {
              await createManagementCenter(data);
            }
            await loadManagementCenters();
            setOpenManagementCenterForm(false);
          } catch (error) {
            console.error("Erro ao salvar centro gestor:", error);
            // O erro será tratado no formulário
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
              await updateRequestingCenter(data);
            } else {
              await createRequestingCenter(data);
            }
            await loadRequestingCenters();
            setOpenRequestingCenterForm(false);
          } catch (error) {
            console.error("Erro ao salvar centro solicitante:", error);
            // O erro será tratado no formulário
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