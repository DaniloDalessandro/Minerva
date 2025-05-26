"use client";

import { useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import OrcamentoForm from "./OrcamentoForm";

export default function Home() {
  const [data, setData] = useState([
    {
      id: "1",
      orcamento: "Orçamento 2023",
      centro_custo: "Diretoria Executiva",
      classe: "OPEX",
      valor_total: 100000,
      valor_utilizado: 50000,
      valor_restante: 50000,
      ano: 2023,
      status: "ATIVO",
    },
    {
      id: "2",
      orcamento: "Orçamento 2024",
      centro_custo: "TI",
      classe: "CAPEX",
      valor_total: 150000,
      valor_utilizado: 20000,
      valor_restante: 130000,
      ano: 2024,
      status: "AGUARDANDO",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleAdd = useCallback(() => {
    setEditingData(null);
    setOpen(true);
  }, []);

  const handleEdit = useCallback((data) => {
    setEditingData(data);
    setOpen(true);
  }, []);

  const handleDelete = useCallback((data) => {
    if (confirm(`Tem certeza que deseja excluir o orçamento ${data.orcamento}?`)) {
      setData(prev => prev.filter(item => item.id !== data.id));
    }
  }, []);

  const handleSubmit = useCallback((formData) => {
    if (formData.id) {
      // Edição
      setData(prev => prev.map(item => 
        item.id === formData.id ? { ...item, ...formData } : item
      ));
    } else {
      // Novo registro
      const newId = Math.max(...data.map(item => parseInt(item.id))) + 1;
      setData(prev => [...prev, { 
        ...formData, 
        id: newId.toString(),
        valor_utilizado: 0,
        valor_restante: formData.valor_total,
        orcamento: `Orçamento ${formData.ano}`
      }]);
    }
  }, [data]);

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
          pageSize={12}
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