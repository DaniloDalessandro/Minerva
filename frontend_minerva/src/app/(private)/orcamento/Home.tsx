"use client";

import { useEffect, useState, useCallback } from "react";
import { columns } from "./columns";
import OrcamentoForm from "./OrcamentoForm";
// Ajuste o caminho abaixo conforme a localização real do arquivo budgets.ts
import { Budget, fetchBudgets, createBudget, updateBudget, deleteBudget } from "../../api/budgets";
import { DataTable } from "@/components/ui/data-table"; // ajuste o path se necessário

export default function Home() {
  const [data, setData] = useState<Budget[]>([]);
  const [open, setOpen] = useState(false);
  const [editingData, setEditingData] = useState<Budget | null>(null);

  useEffect(() => {
    fetchBudgets()
      .then(setData)
      .catch((err) => console.error("Erro ao buscar dados:", err));
  }, []);

  const handleAdd = useCallback(() => {
    setEditingData(null);
    setOpen(true);
  }, []);

  const handleEdit = useCallback((data: Budget) => {
    setEditingData(data);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(async (data: Budget) => {
    if (confirm(`Deseja excluir o orçamento ${data.orcamento}?`)) {
      const ok = await deleteBudget(data.id);
      if (ok) {
        setData((prev) => prev.filter((item) => item.id !== data.id));
      }
    }
  }, []);

  const handleSubmit = useCallback(
    async (formData: Partial<Budget>) => {
      if (formData.id) {
        const updated = await updateBudget(formData.id, formData);
        setData((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await createBudget(formData);
        setData((prev) => [...prev, created]);
      }
      setOpen(false);
      setEditingData(null);
    },
    []
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setEditingData(null);
  }, []);

  return (
    <div className="container mx-auto py-1 px-2">
      <div className="space-y-2">
        <DataTable
          columns={columns(handleEdit, handleDelete)}
          data={data}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Orçamentos"
          pageSize={9}
        />

        <OrcamentoForm
          open={open}
          handleClose={handleClose}
          initialData={editingData}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
