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

export default function SetoresPage() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [openDirectionForm, setOpenDirectionForm] = useState(false);
  const [editingDirection, setEditingDirection] = useState<Direction | null>(null);

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
          onDelete={async (item) => {
            if (item.id && confirm("Excluir direção?")) {
              await deleteDirection(item.id);
              await loadDirections();
            }
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
      </section>
    </div>
  );
}
