import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ManagementCenter } from "@/lib/api/centers";

export const managementCenterColumns = (): ColumnDef<ManagementCenter>[] => [
  {
    accessorKey: "id",
    header: "ID",
    size: 80,
    cell: ({ row }) => (
      <div className="text-center font-mono text-sm">
        {row.getValue("id")}
      </div>
    ),
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="font-medium text-blue-900">
        {row.getValue("name")}
      </div>
    ),
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-xs truncate text-gray-700">
          {description || "—"}
        </div>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return (
        <div className="text-sm text-gray-600">
          {date ? new Date(date).toLocaleDateString("pt-BR") : "—"}
        </div>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
  {
    accessorKey: "updated_at",
    header: "Atualizado em",
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as string;
      return (
        <div className="text-sm text-gray-600">
          {date ? new Date(date).toLocaleDateString("pt-BR") : "—"}
        </div>
      );
    },
    meta: {
      showFilterIcon: true,
    },
  },
];