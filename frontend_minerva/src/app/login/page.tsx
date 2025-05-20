"use client"

import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type User = {
  id: number
  name: string
  email: string
}

// Colunas com ações (editar e excluir)
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex justify-end gap-2">
          <Button size="icon" variant="ghost" onClick={() => alert(`Editar ${user.name}`)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => alert(`Excluir ${user.name}`)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]

const data: User[] = [
  { id: 1, name: "Alice Silva", email: "alice@example.com" },
  { id: 2, name: "João Souza", email: "joao@example.com" },
]

export default function UsersPage() {
  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={data}
        title="Usuários"
        searchable
        sortable
        paginated
      />
    </div>
  )
}
