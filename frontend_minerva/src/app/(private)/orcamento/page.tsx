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
    {
      "id": "3",
      "orcamento": "Orçamento 2023",
      "centro_custo": "Manutenção",
      "classe": "OPEX",
      "valor_total": 80000,
      "valor_utilizado": 40000,
      "valor_restante": 40000,
      "ano": 2023,
      "status": "ATIVO"
    },
    {
      "id": "4",
      "orcamento": "Orçamento 2024",
      "centro_custo": "Operações",
      "classe": "OPEX",
      "valor_total": 120000,
      "valor_utilizado": 60000,
      "valor_restante": 60000,
      "ano": 2024,
      "status": "ATIVO"
    },
    {
      "id": "5",
      "orcamento": "Orçamento 2023",
      "centro_custo": "Segurança",
      "classe": "CAPEX",
      "valor_total": 50000,
      "valor_utilizado": 10000,
      "valor_restante": 40000,
      "ano": 2023,
      "status": "AGUARDANDO"
    },
    {
      "id": "6",
      "orcamento": "Orçamento 2024",
      "centro_custo": "Financeiro",
      "classe": "OPEX",
      "valor_total": 90000,
      "valor_utilizado": 70000,
      "valor_restante": 20000,
      "ano": 2024,
      "status": "ATIVO"
    },
    {
      "id": "7",
      "orcamento": "Orçamento 2023",
      "centro_custo": "TI",
      "classe": "CAPEX",
      "valor_total": 150000,
      "valor_utilizado": 100000,
      "valor_restante": 50000,
      "ano": 2023,
      "status": "FINALIZADO"
    },
    {
      "id": "8",
      "orcamento": "Orçamento 2025",
      "centro_custo": "Engenharia",
      "classe": "OPEX",
      "valor_total": 110000,
      "valor_utilizado": 50000,
      "valor_restante": 60000,
      "ano": 2025,
      "status": "AGUARDANDO"
    },
    {
      "id": "9",
      "orcamento": "Orçamento 2025",
      "centro_custo": "Operações",
      "classe": "CAPEX",
      "valor_total": 200000,
      "valor_utilizado": 120000,
      "valor_restante": 80000,
      "ano": 2025,
      "status": "ATIVO"
    },
    {
      "id": "10",
      "orcamento": "Orçamento 2023",
      "centro_custo": "Jurídico",
      "classe": "OPEX",
      "valor_total": 60000,
      "valor_utilizado": 30000,
      "valor_restante": 30000,
      "ano": 2023,
      "status": "ATIVO"
    },
    {
      "id": "11",
      "orcamento": "Orçamento 2024",
      "centro_custo": "Compras",
      "classe": "OPEX",
      "valor_total": 50000,
      "valor_utilizado": 25000,
      "valor_restante": 25000,
      "ano": 2024,
      "status": "ATIVO"
    },
    {
      "id": "12",
      "orcamento": "Orçamento 2025",
      "centro_custo": "TI",
      "classe": "CAPEX",
      "valor_total": 180000,
      "valor_utilizado": 50000,
      "valor_restante": 130000,
      "ano": 2025,
      "status": "AGUARDANDO"
    },
    {
      "id": "13",
      "orcamento": "Orçamento 2025",
      "centro_custo": "Logística",
      "classe": "OPEX",
      "valor_total": 95000,
      "valor_utilizado": 55000,
      "valor_restante": 40000,
      "ano": 2025,
      "status": "ATIVO"
    },
    {
      "id": "14",
      "orcamento": "Orçamento 2024",
      "centro_custo": "Marketing",
      "classe": "OPEX",
      "valor_total": 70000,
      "valor_utilizado": 30000,
      "valor_restante": 40000,
      "ano": 2024,
      "status": "ATIVO"
    },
    {
      "id": "15",
      "orcamento": "Orçamento 2023",
      "centro_custo": "Manutenção",
      "classe": "CAPEX",
      "valor_total": 85000,
      "valor_utilizado": 50000,
      "valor_restante": 35000,
      "ano": 2023,
      "status": "FINALIZADO"
    },
    {
      "id": "16",
      "orcamento": "Orçamento 2025",
      "centro_custo": "Engenharia",
      "classe": "CAPEX",
      "valor_total": 220000,
      "valor_utilizado": 120000,
      "valor_restante": 100000,
      "ano": 2025,
      "status": "AGUARDANDO"
    },
    {
      "id": "17",
      "orcamento": "Orçamento 2025",
      "centro_custo": "Segurança",
      "classe": "OPEX",
      "valor_total": 95000,
      "valor_utilizado": 45000,
      "valor_restante": 50000,
      "ano": 2025,
      "status": "ATIVO"
    }
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