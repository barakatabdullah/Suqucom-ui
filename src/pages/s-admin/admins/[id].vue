<script lang="ts" setup>
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { getAdminbyId, updateAdmin as updateAdminApi } from './_utils/admins';
import moment from 'moment/min/moment-with-locales';
import * as zod from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import { getAllRoles } from '@/utils/functions';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import Toast from 'primevue/toast';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const route = useRoute();
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();
const queryClient = useQueryClient();
const settingsStore = useSettingsStore();

// Get admin ID from route params and convert to number
const adminId = ref()

onMounted(() => {
    if ("id" in route.params) adminId.value = route.params.id;
});

const mode = ref<'view' | 'edit'>(route.query.mode as 'view' | 'edit' ?? 'view');

function toggleMode() {
    mode.value = mode.value === 'view' ? 'edit' : 'view';
    router.replace({ query: { ...route.query, mode: mode.value } });
}

// Loading states
const isSubmitting = ref(false);
const selectedFile = ref<File | null>(null);
const previewImage = ref<string | null>(null);

// Fetch admin data - improved with better error handling
const { data: adminData, isLoading: isLoadingAdmin, isError: isAdminError } = useQuery({
    queryKey: ['admin', adminId.value],
    queryFn: () => getAdminbyId(adminId.value),

});

// Fetch all roles for the dropdown
const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    select: (data) => data.data,
});

// Form validation schema
const AdminSchema = toTypedSchema(
    zod.object({
        name: zod
            .string()
            .min(2, { message: t('validation.name_min_length') || 'Name must be at least 2 characters' }),
        email: zod
            .string()
            .email({ message: t('validation.email_invalid') || 'Invalid email address' }),
        roles: zod
            .array(zod.number())
            .min(1, { message: t('validation.role_required') || 'At least one role must be selected' }),
        active: zod
            .boolean()
            .default(true),
        password: zod
            .string()
            .min(6, { message: t('validation.password_min_length') || 'Password must be at least 6 characters' })
            .optional()
            .or(zod.literal(''))
    })
);

const { defineField, handleSubmit, errors, resetForm, setValues, values } = useForm({
    validationSchema: AdminSchema,
    initialValues: {
        name: '',
        email: '',
        roles: [],
        active: true,
        password: ''
    }
});

const [name] = defineField('name');
const [email] = defineField('email');
const [roles] = defineField('roles');
const [active] = defineField('active');
const [password] = defineField('password');

// Set form values when admin data loads
watchEffect(() => {
    if (adminData.value) {
        setValues({
            name: adminData.value.name,
            email: adminData.value.email,
            roles: adminData.value.roles.map((role: Role) => role.id),
            active: adminData.value.active,
            password: ''
        });
        if (adminData.value?.avatar && !previewImage.value) {
            previewImage.value = adminData.value.avatar;
        }
    }
});

// Handle file selection for avatar preview
function onFileSelect(event: { files: any[]; }) {
    const file = event.files?.[0];
    if (file) {
        selectedFile.value = file;

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
                previewImage.value = e.target.result as string;
            }
        };
        reader.readAsDataURL(file);
    }
}

// Update the remove preview function
function removePreview() {
    previewImage.value = null;
    selectedFile.value = null;
}

// Update admin mutation
const { mutate: updateAdminMutation, isPending } = useMutation({
    mutationFn: (formData: FormData) => updateAdminApi(adminId.value, formData),
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: t('success') || 'Success',
            detail: t('success.update_success'),
            life: 3000
        });
        queryClient.invalidateQueries({ queryKey: ['admin'] });
        queryClient.invalidateQueries({ queryKey: ['admins'] });
        mode.value = 'view'; // Switch back to view mode after successful update
    },
    onError: (error: any) => {
        toast.add({
            severity: 'error',
            summary: t('error') || 'Error',
            detail: error.response?.data?.message || t('errors.update_failed'),
            life: 5000
        });
    }
});

const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('active', String(values.active));

    if (values.password) {
        formData.append('password', values.password);
    }

    // Handle roles
    if (values.roles && values.roles.length > 0) {
        values.roles.forEach((roleId: number, index: number) => {
            formData.append(`roles[${index}]`, roleId.toString());
        });
    }

    // Handle avatar if uploaded - use selectedFile directly
    if (selectedFile.value) {
        formData.append('avatar', selectedFile.value);
    } else if (previewImage.value === null && adminData.value?.avatar) {
        // If preview was cleared, and there was an avatar before
        formData.append('remove_avatar', '1');
    }

    // Use the mutation
    updateAdminMutation(formData);
});

// Check if admin has a specific role
function hasRole(roleId: number): boolean {
    if (!values.roles) return false;
    return values.roles.includes(roleId);
}

// Confirm before navigating away
onBeforeRouteLeave((to, from, next) => {
    if (mode.value === 'edit' && isFormDirty.value) {
        confirm.require({
            group: 'back',
            message: t('confirmations.unsaved_changes'),
            header: t('confirmations.confirm_navigation'),
            icon: 'i-hugeicons-alert-02',
            acceptLabel: t('confirmations.yes'),
            rejectLabel: t('confirmations.no'),
            accept: () => next(),
            reject: () => next(false)
        });
    } else {
        next();
    }
});

// Track if form is dirty (has changes)
const isFormDirty = computed(() => {
    if (!adminData.value) return false;

    // Compare current form values with original data
    return (
        values.name !== adminData.value.name ||
        values.email !== adminData.value.email ||
        values.active !== adminData.value.active ||
        values.password !== '' ||
        !areRolesEqual(values.roles as number[] || [], adminData.value.roles.map((r: { id: number }) => r.id)) ||
        selectedFile.value !== null || // Check if a new file was selected
        (previewImage.value === null && adminData.value.avatar !== null) // Check if avatar was removed
    );
});


// Helper to compare role arrays
function areRolesEqual(a: number[], b: number[]): boolean {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, idx) => val === sortedB[idx]);
}

// Function to go back to admin list
function goBack() {
    router.push({ name: 'Admins' });
}

// Define translation fallbacks for missing keys
const viewText = computed(() => t('view') || 'View');
const editText = computed(() => t('edit') || 'Edit');
const adminDesc = computed(() => t('admin.discrption') || 'Manage admin details');
</script>

<template>
    <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6 dark:border-neutral-800">
        <Toast />
        <ConfirmDialog group="back">
            <template #message="slotProps">
                <div
                    class="flex flex-col items-center w-full gap-4">
                    <i :class="slotProps.message.icon" class="!text-6xl text-orange-6"></i>
                    <p>{{ slotProps.message.message }}</p>
                </div>
            </template>
        </ConfirmDialog>
        <!-- Header with title and actions -->
        <div class="w-full flex items-center justify-between mb-4">
            <div class="flex flex-col gap-2 items-start">
                <div class="flex items-center gap-2">
                    <Button class="rtl:rotate-180" icon="i-hugeicons-arrow-left-01" text @click="goBack" />
                    <h2 class="font-600 text-6 text-color uppercase">
                        {{ mode === 'view' ? viewText : editText }} {{ $t('admin.singular') || 'Admin' }}
                    </h2>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ adminDesc }}
                </p>
            </div>

            <div class="flex gap-2">
                <Button @click="toggleMode" :label="mode === 'view' ? editText : viewText"
                    :icon="mode === 'view' ? 'pi pi-pencil' : 'pi pi-eye'"
                    :severity="mode === 'view' ? 'primary' : 'secondary'" />
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingAdmin || isLoadingRoles" class="flex justify-center items-center py-16">
            <div class="flex flex-col items-center">
                <ProgressSpinner style="width: 50px; height: 50px" />
                <p class="mt-4 text-gray-600">{{ $t('loading_admin') }}</p>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="isAdminError" class="flex flex-col items-center justify-center p-8">
            <div
                class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl p-6 max-w-md text-center">
                <i class="pi pi-exclamation-triangle text-4xl mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">{{ $t('errors.failed_to_load_data') }}</h3>
                <p class="mb-4">{{ $t('errors.data_load_error') }}</p>
                <Button :label="$t('try_again')" icon="i-hugeicons-refresh"
                    @click="() => queryClient.invalidateQueries({ queryKey: ['admin', adminId.value] })"
                    severity="danger" />
            </div>
        </div>

        <!-- Admin data -->
        <form v-else-if="adminData" @submit.prevent="onSubmit" class="grid grid-cols-12 gap-6">
            <!-- Left column: Avatar & Info -->
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div
                    class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <!-- Profile image section -->
                    <div class="p-5 border-b border-neutral-200 dark:border-neutral-800">
                        <h3 class="text-lg font-semibold mb-4">{{ $t('profile_image') || 'Profile Image' }}</h3>

                        <div v-if="mode === 'view'" class="flex justify-center">
                            <div
                                class="relative h-48 w-48 rounded-full overflow-hidden shadow-md border-4 border-white dark:border-neutral-700">
                                <img v-if="adminData.avatar" :src="adminData.avatar" :alt="adminData.name"
                                    class="h-full w-full object-cover" />
                                <div v-else
                                    class="h-full w-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                                    <i class="pi pi-user text-4xl text-gray-400"></i>
                                </div>
                            </div>
                        </div>

                        <div v-else class="flex flex-col items-center">
                            <!-- Image preview -->
                            <div v-if="previewImage" class="relative mb-4">
                                <div
                                    class="h-48 w-48 rounded-full overflow-hidden shadow-md border-4 border-white dark:border-neutral-700">
                                    <img :src="previewImage" alt="Avatar Preview" class="h-full w-full object-cover" />
                                </div>
                                <Button icon="i-hugeicons-cancel-01" class="absolute -top-2 -right-2 p-2 shadow-md"
                                    severity="danger" rounded aria-label="Remove Image" @click="removePreview" />
                            </div>

                            <!-- File uploader -->
                            <FileUpload v-else :multiple="false" name="demo[]" accept="image/*" :maxFileSize="3000000"
                                @select="onFileSelect" customUpload class="w-full" :pt="{
                                    container: { class: 'w-full border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-6 text-center' }
                                }">
                                <template #header="{ chooseCallback, clearCallback, files }">
                                    <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                                        <div class="flex gap-2">
                                            <Button @click="chooseCallback" icon="i-hugeicons-upload-03" rounded
                                                outlined severity="primary" />

                                            <Button @click="clearCallback()" icon="i-hugeicons-cancel-01" rounded
                                                outlined severity="danger"
                                                :disabled="!files || files.length === 0"></Button>
                                        </div>
                                    </div>
                                </template>
                                <template #empty>
                                    <div class="flex flex-col items-center p-6">
                                        <div
                                            class="flex items-center justify-center aspect-square border-2 rounded-full p-8">
                                            <i class="i-hugeicons-image-upload text-4xl text-muted-color" />
                                        </div>
                                        <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                                    </div>
                                </template>
                            </FileUpload>
                        </div>
                    </div>

                    <!-- Admin information section -->
                    <div v-if="mode === 'view'" class="p-5">
                        <h3 class="text-lg font-semibold mb-4">{{ $t('account_info') || 'Account Info' }}</h3>

                        <div class="space-y-3">
                            <!-- Account created date -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-calendar text-gray-500"></i>
                                    <span class="text-gray-600 dark:text-gray-400">
                                        {{ $t('joined') || 'Joined' }}
                                    </span>
                                </div>
                                <div class="font-medium">
                                    {{ moment(adminData.created_at).locale(settingsStore.settings.lang).format("LL") }}
                                </div>
                            </div>

                            <!-- Account status -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-user text-gray-500"></i>
                                    <span class="text-gray-600 dark:text-gray-400">
                                        {{ $t('status') || 'Status' }}
                                    </span>
                                </div>
                                <Tag :severity="adminData.active ? 'success' : 'danger'"
                                    :value="adminData.active ? ($t('active') || 'Active') : ($t('inactive') || 'Inactive')" />
                            </div>


                        </div>
                    </div>
                </div>
            </div>

            <!-- Right column: Details -->
            <div class="col-span-12 lg:col-span-8">
                <div
                    class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <!-- Details header -->
                    <div class="bg-gray-50 dark:bg-neutral-800 p-5 border-b border-neutral-200 dark:border-neutral-700">
                        <h3 class="font-semibold text-lg">
                            {{ ($t('account_info') || 'Account Info') }}
                        </h3>
                    </div>

                    <!-- Content area -->
                    <div class="p-5">
                        <!-- View mode -->
                        <div v-if="mode === 'view'" class="space-y-6">
                            <!-- Basic info section -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Name -->
                                <div class="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <div class="text-sm text-gray-500 mb-1">{{ $t('name') || 'Name' }}</div>
                                    <div class="text-lg font-medium">{{ adminData.name }}</div>
                                </div>

                                <!-- Email -->
                                <div class="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <div class="text-sm text-gray-500 mb-1">{{ $t('email') || 'Email' }}</div>
                                    <div class="text-lg font-medium">{{ adminData.email }}</div>
                                </div>
                            </div>

                            <!-- Roles section -->
                            <div class="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                <div class="text-sm text-gray-500 mb-2">{{ $t('role.plural') || 'Roles' }}</div>
                                <div class="flex flex-wrap gap-2">
                                    <Tag v-for="role in adminData.roles" :key="role.id" :severity="role.name === 'Super Admin' ? 'danger' :
                                        role.name === 'Admin' ? 'warning' : 'info'" :value="role.name"
                                        class="text-sm" />
                                    <div v-if="!adminData.roles?.length" class="text-gray-500 italic">
                                        {{ $t('no_roles_assigned') || 'No roles assigned' }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Edit mode -->
                        <div v-else class="space-y-6">
                            <!-- Basic info fields -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Name field -->
                                <div class="flex flex-col">
                                    <label for="name" class="text-sm font-medium mb-1">
                                        {{ $t('name') || 'Name' }} *
                                    </label>
                                    <div class="p-input-icon-left w-full">
                                        <i class="pi pi-user"></i>
                                        <InputText id="name" v-model="name" :class="{ 'p-invalid': errors.name }"
                                            class="w-full" placeholder="Enter full name" />
                                    </div>
                                    <small class="p-error mt-1">{{ errors.name || '' }}</small>
                                </div>

                                <!-- Email field -->
                                <div class="flex flex-col">
                                    <label for="email" class="text-sm font-medium mb-1">
                                        {{ $t('email') || 'Email' }} *
                                    </label>
                                    <div class="p-input-icon-left w-full">
                                        <i class="pi pi-envelope"></i>
                                        <InputText id="email" v-model="email" :class="{ 'p-invalid': errors.email }"
                                            class="w-full" placeholder="Enter email address" />
                                    </div>
                                    <small class="p-error mt-1">{{ errors.email || '' }}</small>
                                </div>
                            </div>
                            <!-- Roles selection -->
                            <div class="flex flex-col">
                                <label for="roles" class="text-sm font-medium mb-1">
                                    {{ $t('role.plural') || 'Roles' }} *
                                </label>
                                <MultiSelect id="roles" v-model="roles" :options="rolesData" optionLabel="name"
                                    optionValue="id" :placeholder="$t('select_roles')"
                                    :class="{ 'p-invalid': errors.roles }" display="chip" class="w-full"
                                    aria-describedby="roles-help" />
                                <small class="p-error mt-1">{{ errors.roles || '' }}</small>
                            </div>

                            <!-- Password field -->
                            <div class="flex flex-col">
                                <label for="password" class="text-sm font-medium mb-1">
                                    {{ $t('password') || 'Password' }}
                                </label>
                                <Password id="password" v-model="password" :feedback="false" toggleMask
                                    :invalid="!!errors.password" class="w-full" :pt="{
                                        pcinputtext: {
                                            root: {
                                                class: 'w-full'
                                            }
                                        }
                                    }"
                                    :placeholder="$t('leave_blank_to_keep_current') || 'Leave blank to keep current password'" />
                                <small class="p-error mt-1">{{ errors.password || '' }}</small>
                            </div>

                            <!-- Status toggles -->
                            <!-- Account active -->
                            <div class="flex items-center gap-2">
                                <label class="font-medium">{{ $t('account_active') || 'Account Active' }}</label>
                                <InputSwitch v-model="active" />
                            </div>



                            <!-- Action buttons -->
                            <div
                                class="flex gap-2 justify-end pt-4 border-t border-gray-200 dark:border-neutral-700 mt-6">
                                <Button type="button" @click="mode = 'view'" icon="pi pi-times"
                                    :label="$t('cancel') || 'Cancel'" outlined :disabled="isPending" />
                                <Button type="submit" icon="pi pi-check" :label="$t('save_changes') || 'Save Changes'"
                                    :loading="isPending" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<route lang="yaml">
    name: Admins-id
    meta:
        layout: admin
        requiresAuth: true
</route>