<script lang="ts" setup>
import { useQueryClient, useMutation, useQuery } from "@tanstack/vue-query";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

import { adminApi } from "@/config/axios";

import Toast from "primevue/toast";
import ToggleSwitch from "primevue/toggleswitch";
import { useToast } from "primevue/usetoast";
import { getRoleById } from "./_utils";
import { getAllPermissions } from "@/utils/functions";

const route = useRoute();
const roleId = (route.params as { id: number }).id;

const {
  data,
  isLoading: isRoleLoading,
  error: roleError,
} = useQuery({
  queryKey: ["role", roleId],
  queryFn: () => getRoleById(roleId),
});

const {
  data: permissionGroups,
  isLoading: isPermissionsLoading,
  error: permissionsError,
} = useQuery({
  queryKey: ["permissions"],
  queryFn: getAllPermissions,
});

const toast = useToast();
const queryClient = useQueryClient();

const RoleSchema = toTypedSchema(
  zod.object({
    name: zod.string().min(2, { message: t("validation.name_min_length") }),
    guard_name: zod
      .string()
      .min(2, { message: t("validation.name_min_length") }),
  }),
);

const { defineField, handleSubmit, errors, resetForm, setValues } = useForm({
  validationSchema: RoleSchema,
});

const [name] = defineField("name");
const [guard_name] = defineField("guard_name");
const selectedPermissions = ref<number[]>([]);
const allSelected = ref(false);
const isSubmitting = ref(false);

watchEffect(() => {
  if (data.value) {
    setValues({
      name: data.value.name,
      guard_name: data.value.guard_name,
    });

    if (permissionGroups.value) {
      if (allSelected.value) {
        selectedPermissions.value = Object.values(
          permissionGroups.value || {},
        ).flatMap((group: any) =>
          group.map((permission: any) => permission.id),
        );
      } else {
        selectedPermissions.value = data.value.permissions.map(
          (permission: Permission) => permission.id,
        );
      }
    }
  }
});

// Mutation
const { mutateAsync } = useMutation({
  mutationFn: async (formData: { name: string; guard_name: string }) => {
    isSubmitting.value = true;
    try {
      const res = await adminApi.post(`roles/${roleId}`, {
        name: formData.name,
        guard_name: formData.guard_name,
        permission_ids: allSelected.value
          ? Object.values(permissionGroups.value || {}).flatMap((group: any) =>
              group.map((permission: any) => permission.id),
            )
          : selectedPermissions.value,
      });
      return res.data;
    } finally {
      isSubmitting.value = false;
    }
  },
  onSuccess: () => {
    toast.add({
      severity: "success",
      summary: t("success.update_success"),
      detail: t("role.updated_success"),
      life: 3000,
    });
    queryClient.invalidateQueries({ queryKey: ["roles"] });
    queryClient.invalidateQueries({ queryKey: ["role"] });
  },
  onError: (error) => {
    toast.add({
      severity: "error",
      summary: t("errors.update_failed"),
      detail: t("role.updated_error"),
      life: 3000,
    });
    console.error(error);
  },
});

const onSubmit = handleSubmit((values) => {
  mutateAsync(values);
});

const isLoading = computed(
  () => isRoleLoading.value || isPermissionsLoading.value,
);
const hasError = computed(() => roleError.value || permissionsError.value);
</script>

<template>
  <div
    class="border rounded-6 w-full h-full p-9 flex flex-col gap-6 dark:border-neutral-800 overflow-hidden"
  >
    <Toast />
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-2 items-start">
        <h2 class="font-600 text-6 text-color uppercase">
          {{ $t("role.edit") }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t("role.edit_subtitle") }}
        </p>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-8"
    >
      <ProgressSpinner />
      <p class="mt-4 text-gray-600 dark:text-gray-400">{{ $t("loading") }}</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="hasError"
      class="flex flex-col items-center justify-center p-6 border rounded-4 bg-red-50"
    >
      <i class="pi pi-exclamation-triangle text-red-500 text-4xl mb-2"></i>
      <h3 class="text-red-700 font-medium mb-2">
        {{ t("errors.failed_to_load_data") }}
      </h3>
      <p class="text-red-600 mb-4">{{ roleError || permissionsError }}</p>
      <Button
        severity="danger"
        icon="pi pi-refresh"
        :label="t('try_again')"
        @click="
          () => {
            queryClient.invalidateQueries({ queryKey: ['role', roleId] });
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
          }
        "
      />
    </div>

    <!-- Form -->
    <form
      v-else-if="data"
      @submit="onSubmit"
      class="w-full h-full flex flex-col gap-6 overflow-hidden"
    >
      <!-- Role basic info -->
      <Card class="w-full shadow-none! border dark:border-neutral-800">
        <template #content>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1">
              <label
                class="text-gray-600 dark:text-gray-400 text-3.5 font-semibold"
                for="name"
              >
                {{ $t("name") }}
              </label>
              <InputText v-model="name" :class="{ 'p-invalid': errors.name }" />
              <small v-if="errors.name" class="p-error">{{
                errors.name
              }}</small>
            </div>

            <div class="flex flex-col gap-1">
              <label
                class="text-gray-600 dark:text-gray-400 text-3.5 font-semibold"
                for="guard_name"
              >
                {{ t("guard_name") }}
              </label>
              <InputText
                v-model="guard_name"
                disabled
                :class="{ 'p-invalid': errors.guard_name }"
              />
              <small v-if="errors.guard_name" class="p-error">{{
                errors.guard_name
              }}</small>
              <small class="text-gray-600 dark:text-gray-400">{{
                t("role.guard_name_description")
              }}</small>
            </div>

            <div class="flex flex-col justify-center gap-1">
              <div class="flex items-center gap-2">
                <label>{{ t("role.select_all") }}</label>
                <ToggleSwitch v-model="allSelected" />
              </div>
              <small class="text-gray-600 dark:text-gray-400">{{
                t("role.select_all_description")
              }}</small>
            </div>
          </div>
        </template>
      </Card>

      <!-- Permissions section -->
      <Card class="w-full h-full overflow-auto">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-shield"></i>
            <span class="font-bold text-5">{{ t("role.permissions") }}</span>
          </div>
        </template>

        <template #content>
          <div class="h-full overflow-y-auto">
            <div
              v-if="
                !permissionGroups || Object.keys(permissionGroups).length === 0
              "
              class="flex justify-center items-center py-6 text-gray-500"
            >
              {{ $t("no_permission") }}
            </div>

            <div v-else class="grid grid-cols-1 gap-4">
              <Panel
                class="h-fit"
                toggleable
                v-for="(group, key) in permissionGroups"
                :key="key"
                :pt="{
                  toggleableContent: { class: 'p-4' },
                  header: { class: 'py-3 px-4 bg-gray-50' },
                }"
              >
                <template #header>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-folder"></i>
                    <span class="font-bold">{{ key }}</span>
                  </div>
                </template>

                <div
                  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  <div
                    v-for="(permission, index) in group"
                    :key="index"
                    class="border p-3 rounded-4 flex gap-2 justify-between items-center dark:border-neutral-800"
                    :class="{
                      'bg-neutral-50 dark:bg-neutral-900':
                        selectedPermissions.includes(permission.id) ||
                        allSelected,
                    }"
                  >
                    <span class="truncate">{{ permission.action }}</span>
                    <Checkbox
                      :inputId="permission.id.toString()"
                      :name="permission.action"
                      v-model="selectedPermissions"
                      :value="permission.id"
                      s
                    />
                  </div>
                </div>
              </Panel>
            </div>
          </div>
        </template>
      </Card>

      <div class="flex justify-end gap-3">
        <Button
          type="button"
          class="p-button-outlined"
          :label="t('cancel')"
          icon="pi pi-times"
          @click="$router.push('/s-admin/roles')"
        />
        <Button
          type="submit"
          :label="t('save_changes')"
          icon="pi pi-save"
          :loading="isSubmitting"
        />
      </div>
    </form>
  </div>
</template>

<route lang="yaml">
name: Roles-id
meta:
  layout: admin
  requiresAuth: true
</route>
