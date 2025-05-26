"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash,
  Filter,
  X,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

function Toolbar({ title, table, selectedRow, onAdd, onEdit, onDelete }) {
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

            <Eye className="h-6 w-6 cursor-pointer text-blue-600 hover:text-blue-800"/>
            <Edit 
              className="h-6 w-6 cursor-pointer text-blue-600 hover:text-blue-800" 
              onClick={() => onEdit(selectedRow)}
              aria-label="Editar item"
              role="button"
            />
            <Trash 
              className="h-6 w-6 cursor-pointer text-red-600 hover:text-red-800"
              onClick={() => onDelete(selectedRow)}
              aria-label="Excluir item"
              role="button"
            />
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
                    e.preventDefault();
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
  onAdd,
  onEdit,
  onDelete,
}) {
  const [columnVisibility, setColumnVisibility] = React.useState(
    defaultColumns || {}
  );
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [openFilterId, setOpenFilterId] = React.useState(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
  });

  const handleFilterChange = (columnId, value) => {
    table.getColumn(columnId)?.setFilterValue(value);
  };

  const clearFilter = (columnId) => {
    table.getColumn(columnId)?.setFilterValue("");
    setOpenFilterId(null);
  };

  return (
    <Card className="shadow-lg pb-0.5">
      <CardHeader className="pb-1">
        <Toolbar
          title={title}
          table={table}
          selectedRow={selectedRow}
          onAdd={onAdd}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardHeader>
      <CardContent>
        <div className="border shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const showFilterIcon =
                      header.column.columnDef.meta?.showFilterIcon;
                    const columnId = header.column.id;
                    const filterValue = header.column.getFilterValue();
                    const isFilterOpen = openFilterId === columnId;

                    return (
                      <TableHead key={header.id} className="font-semibold">
                        <div className="flex items-center gap-1">
                          {showFilterIcon && (
                            <div className="relative">
                              <Popover
                                open={isFilterOpen}
                                onOpenChange={(open) => {
                                  if (open) {
                                    setOpenFilterId(columnId);
                                  } else {
                                    setOpenFilterId(null);
                                  }
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenFilterId(isFilterOpen ? null : columnId);
                                    }}
                                  >
                                    <Filter
                                      className={`h-4 w-4 ${
                                        filterValue
                                          ? "text-primary"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    {filterValue && (
                                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary"></span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-60 p-3"
                                  align="start"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium">
                                        Filtrar {header.column.columnDef.header}
                                      </h4>
                                      {filterValue && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 px-2"
                                          onClick={() => clearFilter(columnId)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                    <Input
                                      placeholder={`Filtrar...`}
                                      value={filterValue ?? ""}
                                      onChange={(e) =>
                                        handleFilterChange(
                                          columnId,
                                          e.target.value
                                        )
                                      }
                                      autoFocus
                                    />
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          )}
                          <div
                            className="cursor-pointer select-none flex items-center"
                            onClick={() =>
                              header.column.getCanSort() &&
                              header.column.toggleSorting()
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <span className="ml-1 text-gray-400">
                                {{
                                  asc: "▲",
                                  desc: "▼",
                                }[header.column.getIsSorted()] ?? "↕"}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableHead>
                    );
                  })}
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
              {table.getState().pagination.pageIndex + 1} de{" "}
              {table.getPageCount()}
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