<script setup lang="ts">
import { useCrud } from "@/composables/useCrud";
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
// Fix: Import FilterMatchMode from primevue instead of primevue/api
import PrimeVue from "primevue/config";

interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  template?: boolean;
}

const props = defineProps({
  entityName: {
    type: String,
    required: true,
  },
  queryKey: {
    type: String,
    required: true,
  },
  fetchFn: {
    type: Function as PropType<(params: any) => Promise<any>>,
    required: true,
  },
  deleteFn: {
    type: Function as PropType<(id: number) => Promise<any>>,
    required: true,
  },
  columns: {
    type: Array as PropType<Column[]>,
    required: true,
  },
  defaultSort: {
    type: String,
    default: "id",
  },
  defaultOrder: {
    type: String,
    default: "desc",
  },
  routeNames: {
    type: Object,
    default: () => ({
      add: "",
      edit: "",
      view: "",
    }),
  },
  actionButtons: {
    type: Array,
    default: () => ["view", "edit", "delete"],
  },
});

const { t } = useI18n();
const router = useRouter();
const confirmDialog = ref(false);
const itemToDelete = ref<number | null>(null);
const globalFilterFields = computed(() =>
  props.columns.map((col) => col.field),
);

// Define filters
const filters = ref({
  global: { value: null as string | null, matchMode: "contains" },
});

// Define initial sort and order
const sort = ref(props.defaultSort);
const order = ref(props.defaultOrder);
const rowsPerPage = ref(10);

const {
  data,
  isLoading,
  page,
  rowsPerPage: rowsPerPageCrud,
  sort: _sort,
  order: _order,
  search,
  pageChange,
  changeSort,
  deleteMutation,
  refetch,
} = useCrud({
  queryKey: props.queryKey,
  fetchFn: props.fetchFn,
  deleteFn: props.deleteFn,
  defaultParams: {
    sort: props.defaultSort,
    order: props.defaultOrder,
  },
  messages: {
    deleteSuccess:
      t("common.deleted_successfully", { name: props.entityName }) ||
      `${props.entityName} deleted successfully`,
    deleteError:
      t("common.delete_error", { name: props.entityName }) ||
      `Error deleting ${props.entityName}`,
  },
});

// Sync rowsPerPage between ref and useCrud
rowsPerPage.value = rowsPerPageCrud.value;

function onSort(event: { sortField: string; sortOrder: number }) {
  changeSort(event.sortField, event.sortOrder === 1 ? "asc" : "desc");
}

function onRowClick(event: { data: { id: number } }) {
  if (props.routeNames.view) {
    router.push({ name: props.routeNames.view, params: { id: event.data.id } });
  }
}

function confirmDeleteItem(id: number) {
  itemToDelete.value = id;
  confirmDialog.value = true;
}

function deleteItem() {
  if (itemToDelete.value) {
    deleteMutation(itemToDelete.value);
    confirmDialog.value = false;
  }
}

function onGlobalFilterChange(e: Event) {
  const target = e.target as HTMLInputElement;
  filters.value.global.value = target.value;
  search.value = target.value;
  refetch();
}

// Handle click on refetch button without passing event
function handleRefetch() {
  refetch();
}

// Computed property for pagination first item
const firstItem = computed({
  get: () => (page.value - 1) * rowsPerPage.value,
  set: (val) => {
    const newPage = Math.floor(val / rowsPerPage.value) + 1;
    if (newPage !== page.value) {
      pageChange({ page: newPage - 1, rows: rowsPerPage.value });
    }
  },
});
</script>

<template>
  <div
    class="border rounded-6 w-full h-full p-9 flex flex-col gap-6 dark:border-neutral-800"
  >
    <Toast />
    <ConfirmDialog />

    <div class="w-full flex items-center justify-between flex-wrap gap-4">
      <div class="flex flex-col gap-2 items-start">
        <h2 class="font-600 text-6 text-color uppercase">
          {{ $t(props.entityName + ".plural") }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t(props.entityName + ".description") }}
        </p>
      </div>

      <div class="flex gap-3">
        <Button
          icon="i-heroicons-arrow-path"
          :loading="isLoading"
          @click="handleRefetch"
          severity="secondary"
          text
          tooltip="Refresh"
          tooltipOptions="{ position: 'top' }"
        />
        <Button
          v-if="props.routeNames.add"
          @click="() => router.push({ name: props.routeNames.add })"
          :label="
            $t('common.add', { name: $t(props.entityName + '.singular') }) ||
            'Add'
          "
          icon="i-heroicons-plus"
        />
      </div>
    </div>

    <!-- Search and filters -->
    <div class="flex flex-wrap gap-3 justify-between">
      <div class="p-input-icon-left w-full md:w-auto">
        <i class="i-heroicons-magnifying-glass" />
        <InputText
          v-model="filters.global.value"
          @input="onGlobalFilterChange"
          type="search"
          :placeholder="$t('common.search') || 'Search'"
          class="w-full md:w-80"
        />
      </div>

      <div class="flex align-items-center gap-2">
        <Dropdown
          v-model="rowsPerPage"
          :options="[5, 10, 20, 50]"
          :placeholder="$t('common.rows_per_page') || 'Rows per page'"
          @change="pageChange({ page: page - 1, rows: rowsPerPage })"
        />
      </div>
    </div>

    <!-- Main data table -->
    <div class="h-full overflow-y-auto">
      <DataTable
        :value="data?.data"
        :loading="isLoading"
        v-model:filters="filters"
        :globalFilterFields="globalFilterFields"
        :paginator="false"
        :rows="rowsPerPage"
        sortMode="multiple"
        @sort="onSort"
        removableSort
        dataKey="id"
        stripedRows
        rowHover
        @rowClick="onRowClick"
        :pt="{
          bodyRow: { class: 'cursor-pointer' },
        }"
        class="rounded-xl border overflow-hidden dark:border-neutral-800"
      >
        <!-- Empty state template -->
        <template #empty>
          <div class="flex flex-col items-center justify-center py-8">
            <i class="i-heroicons-document text-4xl text-gray-400 mb-4"></i>
            <span class="text-gray-500">{{
              $t("common.no_items_found") || "No items found"
            }}</span>
            <Button
              @click="handleRefetch"
              icon="i-heroicons-arrow-path"
              label="Refresh"
              class="mt-4"
              text
            />
          </div>
        </template>

        <!-- Loading template -->
        <template #loading>
          <div class="flex justify-center items-center py-8">
            <ProgressSpinner
              style="width: 50px; height: 50px"
              strokeWidth="4"
            />
          </div>
        </template>

        <Column
          v-for="col in props.columns"
          :key="col.field"
          :field="col.field"
          :header="$t(col.header)"
          :sortable="col.sortable !== false"
        >
          <template v-if="col.template" #body="slotProps">
            <slot :name="col.field" :data="slotProps.data" :field="col.field">
              {{ slotProps.data[col.field] }}
            </slot>
          </template>
        </Column>

        <Column
          v-if="props.actionButtons.length > 0"
          :exportable="false"
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <div class="flex gap-2 justify-end">
              <Button
                v-if="
                  props.actionButtons.includes('view') && props.routeNames.view
                "
                icon="i-heroicons-eye"
                @click.stop="
                  $router.push({
                    name: props.routeNames.view,
                    params: { id: slotProps.data.id },
                  })
                "
                text
                rounded
                tooltip="View"
                tooltipOptions="{ position: 'top' }"
              />

              <Button
                v-if="
                  props.actionButtons.includes('edit') && props.routeNames.edit
                "
                icon="i-heroicons-pencil-square"
                @click.stop="
                  $router.push({
                    name: props.routeNames.edit,
                    params: { id: slotProps.data.id },
                    query: { mode: 'edit' },
                  })
                "
                text
                rounded
                tooltip="Edit"
                tooltipOptions="{ position: 'top' }"
              />

              <Button
                v-if="props.actionButtons.includes('delete')"
                icon="i-heroicons-trash"
                @click.stop="confirmDeleteItem(slotProps.data.id)"
                text
                rounded
                severity="danger"
                tooltip="Delete"
                tooltipOptions="{ position: 'top' }"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Pagination -->
      <Paginator
        v-if="data?.meta.total > 0"
        class="border rounded-xl w-full overflow-hidden dark:border-neutral-800 mt-3"
        v-model:first="firstItem"
        v-model:rows="rowsPerPage"
        :totalRecords="data?.meta.total"
        @page="pageChange"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        currentPageReportTemplate="{first} - {last} of {totalRecords}"
      />
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="confirmDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex align-items-center justify-content-center">
        <i
          class="i-heroicons-exclamation-triangle text-2xl text-yellow-500 mr-4"
        ></i>
        <span>{{
          $t("common.delete_confirmation", {
            name: props.entityName + ".singular",
          }) || "Are you sure you want to delete this item?"
        }}</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="i-heroicons-x-mark"
          @click="confirmDialog = false"
          class="p-button-text"
        />
        <Button
          label="Yes"
          icon="i-heroicons-check"
          @click="deleteItem"
          severity="danger"
        />
      </template>
    </Dialog>
  </div>
</template>
