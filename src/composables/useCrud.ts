import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { ref, computed } from 'vue';

export function useCrud<T, K = number>(options: {
  queryKey: string;
  fetchFn: (params: any) => Promise<any>;
  deleteFn: (id: K) => Promise<any>;
  defaultParams?: Record<string, any>;
  messages?: {
    deleteSuccess?: string;
    deleteError?: string;
  }
}) {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  const page = ref(1);
  const rowsPerPage = ref(10);
  const sort = ref('id');
  const order = ref('desc');
  const search = ref('');
  const filters = ref({});
  const loading = ref(false);
  
  const params = computed(() => ({
    page: page.value,
    limit: rowsPerPage.value,
    sort: sort.value,
    order: order.value,
    search: search.value,
    ...options.defaultParams
  }));
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: [options.queryKey, params.value],
    queryFn: () => options.fetchFn(params.value),
placeholderData:keepPreviousData
  });
  
  const { mutateAsync: deleteMutation, isPending: isDeleting } = useMutation({
    mutationFn: options.deleteFn,
    onSuccess: () => {
      toast.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: options.messages?.deleteSuccess || 'Item deleted successfully', 
        life: 3000 
      });
      queryClient.invalidateQueries({ queryKey: [options.queryKey] });
    },
    onError: (error) => {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.message || options.messages?.deleteError || 'Failed to delete item', 
        life: 3000 
      });
    }
  });
  
  function pageChange(event: { page: number; rows: number }) {
    page.value = event.page + 1;
    rowsPerPage.value = event.rows;
    refetch();
  }
  
  function changeSort(field: string, direction: 'asc' | 'desc'): void {
    sort.value = field;
    order.value = direction;
    refetch();
  }
  
  return {
    data,
    isLoading,
    isDeleting,
    page,
    rowsPerPage,
    sort,
    order,
    search,
    filters,
    refetch,
    pageChange,
    changeSort,
    deleteMutation
  };
}