"use client";

import { useState, useCallback } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import OrcamentoForm from "./OrcamentoForm"; // ⬅️ importe correto

const data = [
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
];

export default function Home() {
  const [open, setOpen] = useState(false);

  const handleAdd = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <div className="container mx-auto py-1 px-2">
      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={data}
          onAdd={handleAdd}
          title="Orçamentos"
          pageSize={12}
        />

        {/* Aqui renderiza o modal */}
        <OrcamentoForm open={open} handleClose={handleClose} />
      </div>
    </div>
  );
}
