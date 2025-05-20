"use client";

import { useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";


// Dados de exemplo para a tabela
const data = [
  {
    id: "1",
    employee: "João Silva",
    budget_line: "Orçamento 2023",
    type: "GRADUACAO",
    total_amount: 5000,
    installment_count: 10,
    amount_per_installment: 500,
    start_date: "2023-01-01",
    end_date: "2023-10-01",
    notes: "Auxílio para graduação",
    status: "ATIVO",
  },
  {
    id: "2",
    Funcionario: "Maria Souza",
    budget_line: "Orçamento 2024",
    type: "POS_GRADUACAO",
    total_amount: 8000,
    installment_count: 8,
    amount_per_installment: 1000,
    start_date: "2024-02-01",
    end_date: "2024-09-01",
    notes: "Auxílio para pós-graduação",
    status: "AGUARDANDO",
  },
];

export default function Home() {
  const [open, setOpen] = useState(false);

  const handleAdd = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className="container mx-auto py-1 px-2">
      
      <div className="space-y-2">
        <DataTable columns={columns} data={data} onAdd={handleAdd} title="Orçamentos" pageSize={12} />
      </div>
    </div>
  );
}