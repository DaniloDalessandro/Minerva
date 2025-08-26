"use client";

import { useEffect, useState, useCallback } from "react";
import { columns } from "./columns";
import OrcamentoForm from "./OrcamentoForm";
// Ajuste o caminho abaixo conforme a localização real do arquivo budgets.ts
import { Budget, fetchBudgets, createBudget, updateBudget, deleteBudget } from "../../api/budgets";
import { DataTable } from "@/components/ui/data-table"; // ajuste o path se necessário
import { BudgetDetailsModal } from "@/components/modals/BudgetDetailsModal";

export default function Home() {
  const [data, setData] = useState<Budget[]>([]);
  const [open, setOpen] = useState(false);
  const [editingData, setEditingData] = useState<Budget | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBudgets()
      .then(setData)
      .catch((err) => console.error("Erro ao buscar dados:", err));
  }, []);

  const handleAdd = useCallback(() => {
    setEditingData(null);
    setOpen(true);
  }, []);

  const handleView = useCallback((budget: Budget) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedBudget(null);
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
          columns={columns(handleView)}
          data={data}
          onAdd={handleAdd}
          title="Orçamentos"
          pageSize={9}
        />

        <OrcamentoForm
          open={open}
          handleClose={handleClose}
          initialData={editingData}
          onSubmit={handleSubmit}
        />

        <BudgetDetailsModal
          budget={selectedBudget}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
