"use client";

import React, { useEffect, useState } from "react";
import {
  fetchDirections,
  createDirection,
  updateDirection,
  deleteDirection,
  Direction,
} from "@/lib/api/directions";

import DirectionForm from "@/components/forms/DirectionForm";
import { DataTable } from "@/components/ui/data-table";
import { columns as directionColumns } from "./columns/directions";
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

export default function SetoresPage() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [openDirectionForm, setOpenDirectionForm] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [directionToDelete, setDirectionToDelete] = useState<Direction | null>(null);

  async function loadDirections() {
    try {
      const data = await fetchDirections(page, pageSize);
      setDirections(data.results);
      setTotalCount(data.count);
    } catch (error) {
      console.error("Erro ao carregar direções:", error);
    }
  }

  useEffect(() => {
    loadDirections();
  }, [page, pageSize]);

  const handleDelete = async () => {
    if (directionToDelete?.id) {
      try {
        await deleteDirection(directionToDelete.id);
        await loadDirections();
        
        // Resetar página se a última direção da página foi excluída
        if (directions.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (error) {
        console.error("Erro ao excluir direção:", error);
      } finally {
        setDeleteDialogOpen(false);
        setDirectionToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-10 px-4 py-6">
      <section>
        <DataTable
          title="Direções"
          columns={directionColumns()}
          data={directions}
          pageSize={pageSize}
          pageIndex={page - 1}
          totalCount={totalCount}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(1);
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
            setDeleteDialogOpen(true);
          }}
        />

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

        {/* Modal de confirmação para exclusão */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a direção "{directionToDelete?.name}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}