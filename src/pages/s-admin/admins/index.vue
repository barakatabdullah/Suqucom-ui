<script lang="ts" setup>
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/vue-query";
import { deleteAdmin, getAdmins } from "./_utils/admins";
import moment from "moment/min/moment-with-locales";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import type { PageState } from "primevue/paginator";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import type { DataTableSortEvent } from "primevue/datatable";
import Select from "primevue/select";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const confirm = useConfirm();
const router = useRouter();
const toast = useToast();
const queryClient = useQueryClient();
const settingsStore = useSettingsStore();

// Query parameters
const page = ref(1);
const rowsPerPage = ref(10);
const sortBy = ref("id");
const sortDirection = ref<"asc" | "desc">("desc");
const search = ref("");
const activeFilter = ref<boolean | null>(null);
const roleFilter = ref("");

// Create a reactive params object that combines all filters
const queryParams = computed(() => {
  const params: QueryParams = {
    page: page.value,
    per_page: rowsPerPage.value,
    sort_by: sortBy.value,
    sort_direction: sortDirection.value,
    search: "",
    role: undefined,
    active: null,
  };

  if (search.value) params.search = search.value;
  if (roleFilter.value) params.role = roleFilter.value;
  if (activeFilter.value !== null) params.active = activeFilter.value;

  return params;
});

const { data, isLoading } = useQuery({
  queryKey: ["admins", queryParams.value],
  queryFn: () => getAdmins(queryParams.value),
  placeholderData: keepPreviousData,
});

// Update available roles from data for filtering
const availableRoles = computed(() => {
  if (!data.value?.data) return [];
  const roles = new Set();
  data.value.data.forEach((admin: Admin) => {
    admin.roles.forEach((role: Role) => roles.add(role.name));
  });
  return Array.from(roles);
});

function onRowClick(row: { data: Admin }) {
  router.push({ name: "Admins-id", params: { id: row.data.id } });
}

const { mutateAsync: removeMutate } = useMutation({
  mutationFn: async (id: number) => {
    await deleteAdmin(id);
  },
  onSuccess: () => {
    toast.add({
      severity: "info",
      summary: "Success",
      detail: "User deleted successfully",
      life: 3000,
    });
    queryClient.invalidateQueries({ queryKey: ["admins"] });
  },
  onError: (error) => {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  },
});

function onRemove(id: number) {
  confirm.require({
    group: "back",
    message: t("confirmations.remove_admin"),
    header: t("confirmations.confirm_remove_admin"),
    icon: "i-hugeicons-alert-02",
    acceptLabel: t("confirmations.yes"),
    rejectLabel: t("confirmations.no"),
    accept: () => removeMutate(id),
    reject: () => {},
  });
}

function pageChange(event: PageState) {
  page.value = event.page + 1;
  queryClient.invalidateQueries({ queryKey: ["admins"] });
}

function rowsChange(event: number) {
  rowsPerPage.value = event;
  queryClient.invalidateQueries({ queryKey: ["admins"] });
}

function applySearch(value: string) {
  search.value = value;
  page.value = 1; // Reset to first page when searching
  queryClient.invalidateQueries({ queryKey: ["admins"] });
}

function applySorting(event: DataTableSortEvent) {
  if (sortBy.value === event.sortField) {
    // Toggle direction if clicking the same field
    sortDirection.value = event.sortOrder === 1 ? "asc" : "desc";
  } else {
    // New field, default to asc
    sortBy.value = event.sortField?.toString() || "id";
    sortDirection.value = "asc";
  }
  queryClient.invalidateQueries({ queryKey: ["admins"] });
}

function applyRoleFilter(role: string) {
  roleFilter.value = role;
  page.value = 1; // Reset to first page when filtering
  queryClient.invalidateQueries({ queryKey: ["admins"] });
}

function applyActiveFilter(active: boolean | null) {
  activeFilter.value = active;
  page.value = 1; // Reset to first page when filtering
  queryClient.invalidateQueries({ queryKey: ["admins"] });
}

function resetFilters() {
  search.value = "";
  roleFilter.value = "";
  activeFilter.value = null;
  sortBy.value = "id";
  sortDirection.value = "desc";
  page.value = 1;
  queryClient.invalidateQueries({ queryKey: ["admins"] });
}
</script>

<template>
  <div
    class="border rounded-6 w-full h-full p-9 flex flex-col gap-6 dark:border-neutral-800"
  >
    <Toast />
    <ConfirmDialog group="back">
      <template #message="slotProps">
        <div class="flex flex-col items-center w-full gap-4">
          <i
            :class="slotProps.message.icon"
            class="!text-6xl text-orange-6"
          ></i>
          <p>{{ slotProps.message.message }}</p>
        </div>
      </template>
    </ConfirmDialog>
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-2 items-start">
        <h2 class="font-600 text-6 text-color uppercase">
          {{ $t("admin.plural") }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t("admin.description") }}
        </p>
      </div>

      <Button
        @click="() => $router.push({ name: 'Admins-add' })"
        :label="$t('add', { name: $t('admin.singular') })"
      />
    </div>

    <!-- Search and filters -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div class="flex flex-wrap items-center gap-4 mb-4">
        <IconField>
          <InputIcon class="i-hugeicons-search-01" />
          <InputText
            v-model="search"
            @keyup.enter="applySearch(search)"
            :placeholder="$t('search_by_name_or_email')"
          />
        </IconField>

        <Select
          v-model="roleFilter"
          :options="availableRoles"
          @change="applyRoleFilter(roleFilter)"
          :placeholder="$t('filter_by_role')"
          class="w-48"
        />

        <Select
          v-model="activeFilter"
          :options="[
            { label: $t('active'), value: true },
            { label: $t('inactive'), value: false },
          ]"
          @change="applyActiveFilter(activeFilter)"
          optionLabel="label"
          optionValue="value"
          :placeholder="$t('status')"
          class="w-48"
        />
      </div>

      <Button
        icon="i-hugeicons-filter-reset"
        @click="resetFilters"
        :label="$t('reset_filters')"
        text
        severity="secondary"
      />
    </div>

    <div class="h-full overflow-y-auto">
      <DataTable
        :pt="{
          bodyRow: {
            class: 'cursor-pointer',
          },
        }"
        :loading="isLoading"
        class="rounded-xl border overflow-hidden dark:border-none"
        rowHover
        @rowClick="onRowClick"
        @sort="applySorting"
        :value="data?.data"
      >
        <Column field="name" :header="$t('name')" :sortable="true">
          <template #body="slotProps">
            <div class="text-start w-full">{{ slotProps.data.name }}</div>
          </template>
        </Column>
        <Column field="role" :header="$t('role.plural')">
          <template #body="slotProps">
            <div
              v-if="slotProps.data.roles.length > 0"
              class="flex flex-wrap gap-2"
            >
              <Tag
                v-for="role in slotProps.data.roles"
                :key="role.id"
                :value="role.name"
              />
            </div>
          </template>
        </Column>
        <Column field="email" :header="$t('email')" :sortable="true">
          <template #body="slotProps">
            <div class="text-start">
              {{ slotProps.data.email }}
            </div>
          </template>
        </Column>

        <Column field="active" :header="$t('status')" :sortable="true">
          <template #body="slotProps">
            <div class="text-start">
              <Badge
                :severity="slotProps.data.active ? 'success' : 'danger'"
                :value="$t(slotProps.data.active ? 'active' : 'inactive')"
              />
            </div>
          </template>
        </Column>

        <Column field="created_at" :header="$t('joined_at')" :sortable="true">
          <template #body="slotProps">
            <div class="text-start">
              {{
                moment(slotProps.data.created_at)
                  .locale(settingsStore.settings.lang)
                  .format("LL")
              }}
            </div>
          </template>
        </Column>

        <Column field="edit">
          <template #body="slotProps">
            <Button
              @click="
                () =>
                  $router.push({
                    name: 'Admins-id',
                    params: { id: slotProps.data.id },
                    query: { mode: 'edit' },
                  })
              "
              icon="i-heroicons-pencil-square"
              text
            />
          </template>
        </Column>
        <Column field="remove">
          <template #body="slotProps">
            <Button
              @click="onRemove(slotProps.data.id)"
              icon="i-heroicons-trash"
              text
              severity="danger"
            />
          </template>
        </Column>
      </DataTable>

      <Paginator
        class="border rounded-xl w-full overflow-hidden dark:border-neutral-800 mt-3"
        v-on:page="pageChange"
        v-on:update:rows="rowsChange"
        :rowsPerPageOptions="[10, 20, 30, 50, 100]"
        :rows="rowsPerPage"
        :totalRecords="data?.meta.total"
      />
    </div>
  </div>
</template>

<route lang="yaml">
name: Admins
meta:
  layout: admin
  requiresAuth: true
</route>
