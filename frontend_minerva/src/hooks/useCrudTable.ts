import { useState, useCallback, useEffect } from "react";

export interface CrudService<T> {
  fetch: (
    page?: number,
    pageSize?: number,
    search?: string,
    ordering?: string,
    statusFilter?: string
  ) => Promise<{ results: T[]; count: number }>;
  create?: (data: any) => Promise<{ data?: T } | T>;
  update?: (data: any) => Promise<{ data?: T } | T>;
  delete?: (id: number) => Promise<void>;
  toggleStatus?: (id: number) => Promise<void | T>;
}

export interface UseCrudTableOptions<T> {
  service: CrudService<T>;
  initialPageSize?: number;
  initialStatusFilter?: string;
  onLoadSuccess?: (data: T[]) => void;
  onLoadError?: (error: any) => void;
}

export interface UseCrudTableReturn<T> {
  // Data states
  items: T[];
  totalCount: number;
  isLoading: boolean;

  // Pagination states
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Filter/Sort states
  search: string;
  sorting: any[];
  filters: Record<string, string>;
  statusFilter: string;
  setSearch: (search: string) => void;
  setSorting: (sorting: any[]) => void;
  setFilters: (filters: Record<string, string>) => void;
  setStatusFilter: (filter: string) => void;

  // Form states
  formOpen: boolean;
  editingItem: T | null;
  setFormOpen: (open: boolean) => void;
  setEditingItem: (item: T | null) => void;

  // Delete dialog states
  deleteDialogOpen: boolean;
  itemToDelete: T | null;
  setDeleteDialogOpen: (open: boolean) => void;
  setItemToDelete: (item: T | null) => void;

  // Functions
  loadItems: () => Promise<void>;
  handleAdd: () => void;
  handleEdit: (item: T) => void;
  handleDelete: (item: T) => void;
  handleCloseForm: () => void;
  handleFilterChange: (columnId: string, value: string) => void;
  handleSortingChange: (newSorting: any[]) => void;
  handlePageChange: (newPageIndex: number) => void;
  handlePageSizeChange: (newPageSize: number) => void;
  convertSortingToOrdering: (sorting: any[]) => string;
}

export function useCrudTable<T = any>(
  options: UseCrudTableOptions<T>
): UseCrudTableReturn<T> {
  const {
    service,
    initialPageSize = 10,
    initialStatusFilter = "active",
    onLoadSuccess,
    onLoadError,
  } = options;

  // Data states
  const [items, setItems] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Filter/Sort states
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  // Convert sorting to ordering string
  const convertSortingToOrdering = useCallback((sorting: any[]) => {
    if (!sorting || sorting.length === 0) return "";
    const sortItem = sorting[0];
    const prefix = sortItem.desc ? "-" : "";
    return `${prefix}${sortItem.id}`;
  }, []);

  // Load items function
  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Loading items with params:", {
        page,
        pageSize,
        search,
        sorting,
        filters,
        statusFilter,
      });

      const ordering = convertSortingToOrdering(sorting);

      // Build search params including filters
      const filterValues = Object.values(filters).filter(Boolean);
      const searchParam =
        filterValues.length > 0
          ? filterValues[filterValues.length - 1]
          : search;

      const data = await service.fetch(
        page,
        pageSize,
        searchParam,
        ordering,
        statusFilter
      );

      setItems(data.results);
      setTotalCount(data.count);

      console.log("✅ Items loaded successfully:", data.results.length, "items");

      if (onLoadSuccess) {
        onLoadSuccess(data.results);
      }
    } catch (error) {
      console.error("❌ Error loading items:", error);
      if (onLoadError) {
        onLoadError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    pageSize,
    search,
    sorting,
    filters,
    statusFilter,
    service,
    convertSortingToOrdering,
    onLoadSuccess,
    onLoadError,
  ]);

  // Load items on dependencies change
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Handlers
  const handleAdd = useCallback(() => {
    setEditingItem(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((item: T) => {
    setEditingItem(item);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((item: T) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormOpen(false);
    setEditingItem(null);
  }, []);

  const handleFilterChange = useCallback((columnId: string, value: string) => {
    if (columnId === "status" || columnId === "is_active") {
      setStatusFilter(value);
      setPage(1);
    } else {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (value && value !== "all" && value !== "ALL") {
          newFilters[columnId] = value;
        } else {
          delete newFilters[columnId];
        }
        return newFilters;
      });
      setPage(1);
    }
  }, []);

  const handleSortingChange = useCallback((newSorting: any[]) => {
    setSorting(newSorting);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPageIndex: number) => {
    setPage(newPageIndex + 1);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  return {
    // Data states
    items,
    totalCount,
    isLoading,

    // Pagination states
    page,
    pageSize,
    setPage,
    setPageSize,

    // Filter/Sort states
    search,
    sorting,
    filters,
    statusFilter,
    setSearch,
    setSorting,
    setFilters,
    setStatusFilter,

    // Form states
    formOpen,
    editingItem,
    setFormOpen,
    setEditingItem,

    // Delete dialog states
    deleteDialogOpen,
    itemToDelete,
    setDeleteDialogOpen,
    setItemToDelete,

    // Functions
    loadItems,
    handleAdd,
    handleEdit,
    handleDelete,
    handleCloseForm,
    handleFilterChange,
    handleSortingChange,
    handlePageChange,
    handlePageSizeChange,
    convertSortingToOrdering,
  };
}
