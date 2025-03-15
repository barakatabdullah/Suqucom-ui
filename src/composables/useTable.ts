import { useToast } from "primevue/usetoast";
import { useQueryClient } from "@tanstack/vue-query";
import { reactive, ref, watch } from "vue";

interface TableOptions {
  defaultSort?: string;
  defaultOrder?: string;
  onSearchChange?: (searchValue: string) => void;
  onSortChange?: (sort: { field: string; order: string }) => void;
  onPageChange?: (pagination: Pagination) => void;
}

interface Pagination {
  page: number;
  perPage: number;
  sort: string;
  order: string;
  total: number;
}

interface DeleteOptions {
  queryKey?: string[];
  successMessage?: string;
}

export function useTable(options: TableOptions = {}) {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Pagination state
  const pagination = reactive<Pagination>({
    page: 1,
    perPage: 10,
    sort: options.defaultSort || "id",
    order: options.defaultOrder || "desc",
    total: 0,
  });

  // Search
  const search = ref("");
  const debouncedSearch = ref("");

  // Handle debounced search
  watch(
    search,
    (newValue: string) => {
      debouncedSearch.value = newValue;
      pagination.page = 1; // Reset to first page when searching
      if (options.onSearchChange) {
        options.onSearchChange(newValue);
      }
    },
    { deep: true, flush: "post" },
  );

  // Create a separate watcher for debounced behavior
  let debounceTimer: number | null = null;
  watch(search, (newValue: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (options.onSearchChange) {
        options.onSearchChange(newValue);
      }
    }, 300) as unknown as number;
  });

  // Sorting
  function onSort(event: { sortField: string; sortOrder: number }) {
    pagination.sort = event.sortField;
    pagination.order = event.sortOrder === 1 ? "asc" : "desc";
    if (options.onSortChange) {
      options.onSortChange({ field: pagination.sort, order: pagination.order });
    }
  }

  // Pagination
  function onPageChange(event: { page: number; rows: number }) {
    pagination.page = event.page + 1;
    pagination.perPage = event.rows;
    if (options.onPageChange) {
      options.onPageChange(pagination);
    }
  }

  // Handle delete with confirmation
  function showDeleteConfirmation<T>(
    id: T,
    deleteFn: (id: T) => Promise<any>,
    options: DeleteOptions = {},
  ) {
    return new Promise((resolve, reject) => {
      // Replace this with your UI confirmation dialog component
      if (confirm("Are you sure you want to delete this item?")) {
        deleteFn(id)
          .then(() => {
            toast.add({
              severity: "success",
              summary: "Success",
              detail: options.successMessage || "Item deleted successfully",
              life: 3000,
            });
            if (options.queryKey) {
              queryClient.invalidateQueries({ queryKey: options.queryKey });
            }
            resolve(true);
          })
          .catch((error) => {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: error.message || "Error deleting item",
              life: 3000,
            });
            reject(error);
          });
      } else {
        resolve(false);
      }
    });
  }

  return {
    pagination,
    search,
    debouncedSearch,
    onSort,
    onPageChange,
    showDeleteConfirmation,
  };
}
