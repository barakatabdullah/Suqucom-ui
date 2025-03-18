<script lang="ts" setup>
import { getAllRoles } from "@/utils/functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import moment from "moment";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { deleteRole } from "./_utils";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from "primevue/confirmdialog";

const router = useRouter();
const toast = useToast();
const queryClient = useQueryClient();
const { t } = useI18n();
const confirm = useConfirm();
const selectedRole = ref<Role | null>(null);

const {
  data: roles,
  isLoading,
  error,
} = useQuery({
  queryKey: ["roles"],
  queryFn: getAllRoles,
  select: (data) => data.data,
});

function onRowClick(row: any) {
  router.push({ name: "Roles-id", params: { id: row.data.id } });
}

const confirmDelete = (role: Role) => {
  console.log("delete");
  selectedRole.value = role;
  confirm.require({
    group: "roleDelete",
    message: t("delete_confirmation"),
    header: t("delete"),
    icon: "i-heroicons-exclamation-triangle text-orange-500",
    acceptLabel: t("confirmations.yes"),
    rejectLabel: t("confirmations.no"),
    accept: () => {
      if (selectedRole.value) {
        removeMutate(selectedRole.value.id);
      }
    },
    reject: () => {
      selectedRole.value = null;
    },
  });
};

const { mutateAsync: removeMutate, isPending: isDeleting } = useMutation({
  mutationFn: async (id: number) => {
    await deleteRole(id);
  },
  onSuccess: () => {
    toast.add({
      severity: "success",
      summary: t("success.update_success"),
      detail: t("delete_success"),
      life: 3000,
    });
    queryClient.invalidateQueries({ queryKey: ["roles"] });
  },
  onError: (error: any) => {
    toast.add({
      severity: "error",
      summary: t("errors.update_failed"),
      detail: error.response?.data || t("delete_failed"),
      life: 3000,
    });
  },
});
</script>

<template>
  <div
    class="border rounded-6 w-full h-full p-9 flex flex-col gap-6 bg-white dark:bg-gray-900 shadow-sm"
  >
    <Toast />
    <ConfirmDialog class="min-w-30rem" group="roleDelete">
      <template #message="slotProps">
        <div class="flex flex-col items-center w-full gap-4">
          <i
            :class="slotProps.message.icon"
            class="!text-6xl text-orange-500"
          ></i>
          <div class="text-center">
            <p class="mb-3">{{ slotProps.message.message }}</p>
            <div
              class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-2"
              v-if="selectedRole"
            >
              <div class="flex items-center gap-2 mb-2">
                <i class="i-heroicons-identification text-primary"></i>
                <span class="font-medium">{{ selectedRole.name }}</span>
              </div>
              <div class="text-sm text-gray-500 flex items-center gap-2">
                <i class="i-heroicons-shield-check"></i>
                {{ selectedRole.guard_name }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </ConfirmDialog>

    <!-- Header section -->
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-2 items-start">
        <div class="flex items-center gap-2">
          <i class="i-heroicons-user-group text-6 text-primary"></i>
          <h2 class="font-600 text-6 text-color">{{ t("role.plural") }}</h2>
        </div>
        <p class="text-gray-600">{{ t("role.description") }}</p>
      </div>

      <Button
        @click="() => $router.push({ name: 'Roles-add' })"
        :label="t('add', { name: t('role.singular') })"
        icon="i-heroicons-plus"
        class="p-button-primary"
      />
    </div>

    <!-- Divider -->
    <Divider class="my-2" />

    <!-- Table section -->
    <div class="h-full overflow-y-auto">
      <Card
        v-if="error"
        class="border-red-200 mb-4 bg-red-50 dark:bg-red-900/20"
      >
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-red-600 dark:text-red-400 mb-2">
                {{ t("errors.failed_to_load_data") }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ error?.message }}
              </p>
            </div>
            <Button
              icon="i-heroicons-arrow-path"
              @click="
                () => queryClient.invalidateQueries({ queryKey: ['roles'] })
              "
              :label="t('try_again')"
              outlined
            />
          </div>
        </template>
      </Card>

      <div v-if="isLoading" class="flex justify-center items-center p-8">
        <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        <span class="ml-3">{{ t("loading") }}</span>
      </div>

      <div
        v-else-if="!roles || roles.length === 0"
        class="border rounded-lg p-8 text-center bg-gray-50 dark:bg-gray-800"
      >
        <i class="i-heroicons-user-group text-8 text-gray-400 mb-2"></i>
        <h3 class="text-lg font-medium mb-2">{{ t("no_role") }}</h3>
        <p class="text-gray-500 mb-4">{{ t("no_data") }}</p>
        <Button
          @click="() => $router.push({ name: 'Roles-add' })"
          :label="t('add', { name: t('role.singular') })"
          icon="i-heroicons-plus"
        />
      </div>

      <DataTable
        v-else
        :pt="{
          bodyRow: {
            class:
              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
          },
        }"
        class="rounded-lg border overflow-hidden"
        rowHover
        @rowClick="onRowClick"
        :value="roles"
        stripedRows
        tableStyle="min-width: 50rem"
      >
        <Column field="name" :header="t('name')" sortable>
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <i class="i-heroicons-identification text-primary"></i>
              <span class="font-medium">{{ slotProps.data.name }}</span>
            </div>
          </template>
        </Column>

        <Column field="guard_name" :header="t('guard_name')" sortable>
          <template #body="slotProps">
            <div class="flex items-start">
              <Badge :value="slotProps.data.guard_name" />
            </div>
          </template>
        </Column>

        <Column field="created_at" :header="t('created_at')" sortable>
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <i class="i-heroicons-calendar text-gray-500"></i>
              {{ moment(slotProps.data.created_at).format("MMM Do YY") }}
            </div>
          </template>
        </Column>

        <Column :header="t('actions')" style="width: 12rem">
          <template #body="slotProps">
            <div class="flex gap-2 justify-end">
              <Button
                @click.stop="
                  () =>
                    $router.push({
                      name: 'Roles-id',
                      params: { id: slotProps.data.id },
                    })
                "
                icon="i-heroicons-eye"
                text
                v-tooltip="t('view')"
              />

              <Button
                @click.stop="
                  () =>
                    $router.push({
                      name: 'Roles-id',
                      params: { id: slotProps.data.id },
                      query: { mode: 'edit' },
                    })
                "
                icon="i-heroicons-pencil-square"
                text
                v-tooltip="t('edit')"
              />

              <Button
                @click.stop="() => confirmDelete(slotProps.data)"
                icon="i-heroicons-trash"
                text
                severity="danger"
                v-tooltip="t('delete')"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<route lang="yaml">
name: Roles
meta:
  layout: admin
  requiresAuth: true
</route>
