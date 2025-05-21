import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// Toolbar com suporte a edição e exclusão
function Toolbar({ title, table, selectedRow, onAdd }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      <div className="flex items-center gap-4">
        <Plus
          className="h-6 w-6 cursor-pointer"
          onClick={onAdd}
          aria-label="Adicionar novo item"
          role="button"
        />
        {selectedRow && (
          <>
            <Edit className="h-6 w-6 cursor-pointer" />
            <Trash className="h-6 w-6 cursor-pointer" />
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Settings className="h-6 w-6 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onSelect={(e) => {
                    e.preventDefault(); // impede o fechamento do menu
                    column.toggleVisibility(!column.getIsVisible());
                  }}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function DataTable({
  columns,
  data,
  title,
  defaultColumns,
  pageSize = 10,
  onAdd
}) {
  const [columnVisibility, setColumnVisibility] = React.useState(defaultColumns || {});
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [sorting, setSorting] = React.useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: pageSize
      }
    },
    state: {
      sorting,
      columnVisibility
    }
  });

  return (
    <Card className="shadow-lg pb-0.5">
      <CardHeader className="pb-1">
        <Toolbar
          title={title}
          table={table}
          selectedRow={selectedRow}
          onAdd={onAdd}
        />
      </CardHeader>
      <CardContent>
        <div className="border shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold cursor-pointer select-none"
                      onClick={() =>
                        header.column.getCanSort() && header.column.toggleSorting()
                      }>
                      <div className="flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="ml-1 text-gray-400">
                            {{
                              asc: "▲",
                              desc: "▼"
                            }[header.column.getIsSorted()] ?? "↕"}
                          </span>
                        )}
                      </div>
                    </TableHead>

                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="max-h-64 overflow-y-auto">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedRow?.id === row.original.id ? "bg-gray-200" : ""
                    }`}
                    onClick={() =>
                      setSelectedRow(
                        selectedRow?.id === row.original.id ? null : row.original
                      )
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500 italic"
                  >
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Controles de Paginação */}
        <div className="flex items-center justify-between py-1">
          <span className="text-sm text-gray-600">
            Total de registros: {data.length}
          </span>
          <div className="flex items-center gap-2">
            <select
              className="text-sm border px-2 py-1 rounded"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} por página
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">
              {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
