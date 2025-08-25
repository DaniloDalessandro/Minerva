"use client";

import React, { useEffect, useState } from "react";
import {
  fetchDirections,
  createDirection,
  updateDirection,
  deleteDirection,
  Direction,
} from "@/lib/api/directions";
import {
  fetchManagements,
  createManagement,
  updateManagement,
  deleteManagement,
  Management,
} from "@/lib/api/managements";
import {
  fetchCoordinations,
  createCoordination,
  updateCoordination,
  deleteCoordination,
  Coordination,
} from "@/lib/api/coordinations";

import DirectionForm from "@/components/forms/DirectionForm";
import ManagementForm from "@/components/forms/ManagementForm";
import CoordinationForm from "@/components/forms/CoordinationForm";
import { DataTable } from "@/components/ui/data-table";
import { columns as directionColumns } from "./columns/directions";
import { columns as managementColumns } from "./columns/managements";
import { columns as coordinationColumns } from "./columns/coordinations";
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

export default function SetoresPage() {
  // States for Directions
  const [directions, setDirections] = useState<Direction[]>([]);
  const [totalDirections, setTotalDirections] = useState(0);
  const [directionPage, setDirectionPage] = useState(1);
  const [directionPageSize, setDirectionPageSize] = useState(10);
  const [directionSearch, setDirectionSearch] = useState("");
  const [directionSorting, setDirectionSorting] = useState([]);
  const [openDirectionForm, setOpenDirectionForm] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(
    null
  );
  const [deleteDirectionDialogOpen, setDeleteDirectionDialogOpen] =
    useState(false);
  const [directionToDelete, setDirectionToDelete] = useState<Direction | null>(
    null
  );

  // States for Managements
  const [managements, setManagements] = useState<Management[]>([]);
  const [totalManagements, setTotalManagements] = useState(0);
  const [managementPage, setManagementPage] = useState(1);
  const [managementPageSize, setManagementPageSize] = useState(10);
  const [managementSearch, setManagementSearch] = useState("");
  const [managementSorting, setManagementSorting] = useState([]);
  const [openManagementForm, setOpenManagementForm] = useState(false);
  const [editingManagement, setEditingManagement] =
    useState<Management | null>(null);
  const [deleteManagementDialogOpen, setDeleteManagementDialogOpen] =
    useState(false);
  const [managementToDelete, setManagementToDelete] =
    useState<Management | null>(null);

  // States for Coordinations
  const [coordinations, setCoordinations] = useState<Coordination[]>([]);
  const [totalCoordinations, setTotalCoordinations] = useState(0);
  const [coordinationPage, setCoordinationPage] = useState(1);
  const [coordinationPageSize, setCoordinationPageSize] = useState(10);
  const [coordinationSearch, setCoordinationSearch] = useState("");
  const [coordinationSorting, setCoordinationSorting] = useState([]);
  const [openCoordinationForm, setOpenCoordinationForm] = useState(false);
  const [editingCoordination, setEditingCoordination] =
    useState<Coordination | null>(null);
  const [deleteCoordinationDialogOpen, setDeleteCoordinationDialogOpen] =
    useState(false);
  const [coordinationToDelete, setCoordinationToDelete] =
    useState<Coordination | null>(null);

  const convertSortingToOrdering = (sorting: any[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  };

  // Load functions
  async function loadDirections() {
    try {
      const ordering = convertSortingToOrdering(directionSorting);
      const data = await fetchDirections(
        directionPage,
        directionPageSize,
        directionSearch,
        ordering
      );
      setDirections(data.results);
      setTotalDirections(data.count);
    } catch (error) {
      console.error("Erro ao carregar direções:", error);
    }
  }

  async function loadManagements() {
    try {
      const ordering = convertSortingToOrdering(managementSorting);
      const data = await fetchManagements(
        managementPage,
        managementPageSize,
        managementSearch,
        ordering
      );
      setManagements(data.results);
      setTotalManagements(data.count);
    } catch (error) {
      console.error("Erro ao carregar gerências:", error);
    }
  }

  async function loadCoordinations() {
    try {
      const ordering = convertSortingToOrdering(coordinationSorting);
      const data = await fetchCoordinations(
        coordinationPage,
        coordinationPageSize,
        coordinationSearch,
        ordering
      );
      setCoordinations(data.results);
      setTotalCoordinations(data.count);
    } catch (error) {
      console.error("Erro ao carregar coordenações:", error);
    }
  }

  useEffect(() => {
    loadDirections();
  }, [directionPage, directionPageSize, directionSearch, directionSorting]);

  useEffect(() => {
    loadManagements();
  }, [
    managementPage,
    managementPageSize,
    managementSearch,
    managementSorting,
  ]);

  useEffect(() => {
    loadCoordinations();
  }, [
    coordinationPage,
    coordinationPageSize,
    coordinationSearch,
    coordinationSorting,
  ]);

  // Delete handlers
  const handleDeleteDirection = async () => {
    if (directionToDelete?.id) {
      try {
        await deleteDirection(directionToDelete.id);
        await loadDirections();
        if (directions.length === 1 && directionPage > 1) {
          setDirectionPage(directionPage - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir direção:", error);
      } finally {
        setDeleteDirectionDialogOpen(false);
        setDirectionToDelete(null);
      }
    }
  };

  const handleDeleteManagement = async () => {
    if (managementToDelete?.id) {
      try {
        await deleteManagement(managementToDelete.id);
        await loadManagements();
        if (managements.length === 1 && managementPage > 1) {
          setManagementPage(managementPage - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir gerência:", error);
      } finally {
        setDeleteManagementDialogOpen(false);
        setManagementToDelete(null);
      }
    }
  };

  const handleDeleteCoordination = async () => {
    if (coordinationToDelete?.id) {
      try {
        await deleteCoordination(coordinationToDelete.id);
        await loadCoordinations();
        if (coordinations.length === 1 && coordinationPage > 1) {
          setCoordinationPage(coordinationPage - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir coordenação:", error);
      } finally {
        setDeleteCoordinationDialogOpen(false);
        setCoordinationToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-10 px-4 py-6">
      <Tabs defaultValue="directions" className="w-full">
        <TabsList className="p-2 w-full justify-around">
          <TabsTrigger value="directions" className="text-lg p-2 bg-gray-200 text-gray-700 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-900">Direções</TabsTrigger>
          <TabsTrigger value="managements" className="text-lg p-2 bg-gray-200 text-gray-700 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-900">Gerências</TabsTrigger>
          <TabsTrigger value="coordinations" className="text-lg p-2 bg-gray-200 text-gray-700 data-[state=active]:bg-gray-300 data-[state=active]:text-gray-900">Coordenações</TabsTrigger>
        </TabsList>
        <TabsContent value="directions">
          <DataTable
            columns={directionColumns()}
            data={directions}
            pageSize={directionPageSize}
            pageIndex={directionPage - 1}
            totalCount={totalDirections}
            onPageChange={(newPageIndex) => setDirectionPage(newPageIndex + 1)}
            onPageSizeChange={(newPageSize) => {
              setDirectionPageSize(newPageSize);
              setDirectionPage(1);
            }}
            onAdd={() => {
              setEditingDirection(null);
              setOpenDirectionForm(true);
            }}
            onEdit={(item) => {
              setEditingDirection(item);
              setOpenDirectionForm(true);
            }}
            onDelete={(item) => {
              setDirectionToDelete(item);
              setDeleteDirectionDialogOpen(true);
            }}
            onFilterChange={(columnId, value) => {
              if (columnId === "name") {
                setDirectionSearch(value);
                setDirectionPage(1);
              }
            }}
            onSortingChange={(newSorting) => {
              setDirectionSorting(newSorting);
              setDirectionPage(1);
            }}
          />
        </TabsContent>
        <TabsContent value="managements">
          <DataTable
            columns={managementColumns()}
            data={managements}
            pageSize={managementPageSize}
            pageIndex={managementPage - 1}
            totalCount={totalManagements}
            onPageChange={(newPageIndex) =>
              setManagementPage(newPageIndex + 1)
            }
            onPageSizeChange={(newPageSize) => {
              setManagementPageSize(newPageSize);
              setManagementPage(1);
            }}
            onAdd={() => {
              setEditingManagement(null);
              setOpenManagementForm(true);
            }}
            onEdit={(item) => {
              setEditingManagement(item);
              setOpenManagementForm(true);
            }}
            onDelete={(item) => {
              setManagementToDelete(item);
              setDeleteManagementDialogOpen(true);
            }}
            onFilterChange={(columnId, value) => {
              if (columnId === "name") {
                setManagementSearch(value);
                setManagementPage(1);
              }
            }}
            onSortingChange={(newSorting) => {
              setManagementSorting(newSorting);
              setManagementPage(1);
            }}
          />
        </TabsContent>
        <TabsContent value="coordinations">
          <DataTable
            columns={coordinationColumns()}
            data={coordinations}
            pageSize={coordinationPageSize}
            pageIndex={coordinationPage - 1}
            totalCount={totalCoordinations}
            onPageChange={(newPageIndex) =>
              setCoordinationPage(newPageIndex + 1)
            }
            onPageSizeChange={(newPageSize) => {
              setCoordinationPageSize(newPageSize);
              setCoordinationPage(1);
            }}
            onAdd={() => {
              setEditingCoordination(null);
              setOpenCoordinationForm(true);
            }}
            onEdit={(item) => {
              setEditingCoordination(item);
              setOpenCoordinationForm(true);
            }}
            onDelete={(item) => {
              setCoordinationToDelete(item);
              setDeleteCoordinationDialogOpen(true);
            }}
            onFilterChange={(columnId, value) => {
              if (columnId === "name") {
                setCoordinationSearch(value);
                setCoordinationPage(1);
              }
            }}
            onSortingChange={(newSorting) => {
              setCoordinationSorting(newSorting);
              setCoordinationPage(1);
            }}
          />
        </TabsContent>
      </Tabs>

      <DirectionForm
        open={openDirectionForm}
        handleClose={() => setOpenDirectionForm(false)}
        initialData={editingDirection}
        onSubmit={async (data) => {
          if (data.id) {
            await updateDirection(data);
          } else {
            await createDirection(data);
          }
          await loadDirections();
          setOpenDirectionForm(false);
        }}
      />
      <AlertDialog
        open={deleteDirectionDialogOpen}
        onOpenChange={setDeleteDirectionDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a direção "
              {directionToDelete?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDirection}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ManagementForm
        open={openManagementForm}
        handleClose={() => setOpenManagementForm(false)}
        initialData={editingManagement}
        onSubmit={async (data) => {
          if (data.id) {
            await updateManagement(data);
          } else {
            await createManagement(data);
          }
          await loadManagements();
          setOpenManagementForm(false);
        }}
      />
      <AlertDialog
        open={deleteManagementDialogOpen}
        onOpenChange={setDeleteManagementDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a gerência "
              {managementToDelete?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteManagement}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CoordinationForm
        open={openCoordinationForm}
        handleClose={() => setOpenCoordinationForm(false)}
        initialData={editingCoordination}
        onSubmit={async (data) => {
          if (data.id) {
            await updateCoordination(data);
          } else {
            await createCoordination(data);
          }
          await loadCoordinations();
          setOpenCoordinationForm(false);
        }}
      />
      <AlertDialog
        open={deleteCoordinationDialogOpen}
        onOpenChange={setDeleteCoordinationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a coordenação "
              {coordinationToDelete?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCoordination}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}