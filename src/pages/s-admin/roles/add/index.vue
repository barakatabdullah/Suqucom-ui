<script lang="ts" setup>
import { useQueryClient, useMutation, useQuery } from "@tanstack/vue-query";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { useI18n } from "vue-i18n";
import { adminApi } from "@/config/axios";

import ToggleSwitch from "primevue/toggleswitch";
import { getAllPermissions } from "@/utils/functions";
import { useToastStore } from "@/stores/toast";

const { t } = useI18n();
const router = useRouter();
const toastStore = useToastStore();

const {
  data: permissionGroups,
  isLoading: isPermissionsLoading,
  error: permissionsError,
} = useQuery({
  queryKey: ["permissions"],
  queryFn: getAllPermissions,
});

const queryClient = useQueryClient();

const RoleSchema = toTypedSchema(
  zod.object({
    name: zod
      .string()
      .nonempty({ message: t("validation.required") })
      .min(2, { message: t("validation.name_min_length") }),
    guard_name: zod
      .string()
      .nonempty({ message: t("validation.required") })
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

// Helper function to get all permission IDs
const getAllPermissionIds = computed(() => {
  if (!permissionGroups.value) return [];
  return Object.values(permissionGroups.value).flatMap((group: any) =>
    group.map((permission: any) => permission.id),
  );
});

// Watch allSelected to update selectedPermissions
watch(allSelected, (newVal) => {
  if (newVal && permissionGroups.value) {
    selectedPermissions.value = getAllPermissionIds.value;
  } else {
    selectedPermissions.value = [];
  }
});

// Watch selectedPermissions to auto-detect when all are selected
watch(
  selectedPermissions,
  (newVal) => {
    if (!permissionGroups.value) return;

    const allIds = getAllPermissionIds.value;
    if (allIds.length > 0 && newVal.length === allIds.length) {
      // Check if all permissions are included
      const allIncluded = allIds.every((id) => newVal.includes(id));
      // Only set true if not already true (to avoid loops)
      if (allIncluded && !allSelected.value) {
        allSelected.value = true;
      }
    } else if (allSelected.value) {
      // If not all selected but flag is true, set to false
      allSelected.value = false;
    }
  },
  { deep: true },
);

// Set default guard_name
onMounted(() => {
  setValues({
    name: "",
    guard_name: "admin",
  });
});

// Mutation
const { mutateAsync } = useMutation({
  mutationFn: async (formData: { name: string; guard_name: string }) => {
    isSubmitting.value = true;
    try {
      const res = await adminApi.post("roles", {
        name: formData.name,
        guard_name: formData.guard_name,
        permission_ids: allSelected.value
          ? getAllPermissionIds.value
          : selectedPermissions.value,
      });
      return res.data;
    } finally {
      isSubmitting.value = false;
    }
  },
  onSuccess: (res) => {
    toastStore.success(t("success.create_success"), t("role.created_success"));

    queryClient.invalidateQueries({ queryKey: ["roles"] });
    router.push({ name: "Roles-id", params: { id: res.data.id } });
  },
  onError: (error) => {
    toastStore.error(
      t("errors.create_failed"),
      t("role.add_error", "Failed to create role"),
    );
  },
});

const onSubmit = handleSubmit((values) => {
  mutateAsync(values);
});
</script>

<template>
  <div
    class="border rounded-6 w-full h-full p-9 flex flex-col gap-6 dark:border-neutral-800 overflow-hidden"
  >
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-2 items-start">
        <h2 class="font-600 text-6 text-color uppercase">
          {{ $t("role.add", "Add Role") }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{
            $t(
              "role.add_subtitle",
              "You can create a new role and assign permissions",
            )
          }}
        </p>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="isPermissionsLoading"
      class="flex flex-col items-center justify-center py-8"
    >
      <ProgressSpinner />
      <p class="mt-4 text-gray-600 dark:text-gray-400">{{ $t("loading") }}</p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="permissionsError"
      class="flex flex-col items-center justify-center p-6 border rounded-4 bg-red-50 dark:bg-red-900/20"
    >
      <i class="pi pi-exclamation-triangle text-red-500 text-4xl mb-2"></i>
      <h3 class="text-red-700 dark:text-red-400 font-medium mb-2">
        {{ t("errors.failed_to_load_data") }}
      </h3>
      <p class="text-red-600 dark:text-red-300 mb-4">{{ permissionsError }}</p>
      <Button
        severity="danger"
        icon="pi pi-refresh"
        :label="t('try_again')"
        @click="
          () => {
            queryClient.invalidateQueries({ queryKey: ['permissions'] });
          }
        "
      />
    </div>

    <!-- Form -->
    <form
      v-else
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
              <small class="text-gray-600 dark:text-gray-400">
                {{ t("role.guard_name_description") }}
              </small>
            </div>

            <div class="flex flex-col justify-center gap-1">
              <div class="flex items-center gap-2">
                <label>{{ t("role.select_all") }}</label>
                <ToggleSwitch v-model="allSelected" />
              </div>
              <small class="text-gray-600 dark:text-gray-400">
                {{ t("role.select_all_description") }}
              </small>
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
                  header: { class: 'py-3 px-4 bg-gray-50 dark:bg-neutral-800' },
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
                      :disabled="allSelected"
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
          @click="$router.push({ name: 'Roles' })"
        />
        <Button
          type="submit"
          :label="t('save')"
          icon="pi pi-save"
          :loading="isSubmitting"
        />
      </div>
    </form>
  </div>
</template>

<route lang="yaml">
name: Roles-add
meta:
  layout: admin
  requiresAuth: true
</route>
