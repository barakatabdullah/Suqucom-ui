<script lang="ts" setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import * as zod from 'zod';
import { getAllRoles } from '@/utils/functions';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { createAdmin } from '../_utils/admins';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const queryClient = useQueryClient();

// Loading states
const isSubmitting = ref(false);
const selectedFile = ref<File | null>(null);
const previewImage = ref<string | null>(null);

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
    })
);

const { defineField, handleSubmit, errors, resetForm } = useForm({
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

// Fetch all roles for dropdown
const { data: rolesData, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    select: (data) => data.data,
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

// Remove preview function
function removePreview() {
    previewImage.value = null;
    selectedFile.value = null;
}

// Create admin mutation
const { mutate: createAdminMutation, isPending } = useMutation({
    mutationFn: (formData: FormData) => createAdmin(formData),
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: t('success') || 'Success',
            detail: t('add_success') || 'Admin added successfully',
            life: 3000
        });
        queryClient.invalidateQueries({ queryKey: ['admins'] });
        resetForm();
        selectedFile.value = null;
        previewImage.value = null;
        router.push({ name: 'Admins' });
    },
    onError: (error: any) => {
        toast.add({
            severity: 'error',
            summary: t('error') || 'Error',
            detail: error.response?.data?.message || t('add_failed') || 'Failed to add admin',
            life: 5000
        });
    }
});

const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('active', String(values.active));
    formData.append('password', values.password);

    // Handle roles
    if (values.roles && values.roles.length > 0) {
        values.roles.forEach((roleId: number, index: number) => {
            formData.append(`roles[${index}]`, roleId.toString());
        });
    }

    // Handle avatar if uploaded
    if (selectedFile.value) {
        formData.append('avatar', selectedFile.value);
    }

    // Use the mutation
    createAdminMutation(formData);
});

// Function to go back to admin list
function goBack() {
    router.push({ name: 'Admins' });
}
</script>

<template>
    <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6 dark:border-neutral-800">
        <Toast />
        
        <!-- Header with title and actions -->
        <div class="w-full flex items-center justify-between mb-4">
            <div class="flex flex-col gap-2 items-start">
                <div class="flex items-center gap-2">
                    <Button class="rtl:rotate-180" icon="i-hugeicons-arrow-left-01" text @click="goBack" />
                    <h2 class="font-600 text-6 text-color uppercase">
                        {{ $t('add', { name: $t('admin.singular') }) || 'Add Admin' }}
                    </h2>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ $t('admin.discrption') || 'You can manage admins, edit or delete them' }}
                </p>
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingRoles" class="flex justify-center items-center py-8">
            <div class="flex flex-col items-center">
                <ProgressSpinner style="width: 50px; height: 50px" />
                <p class="mt-4 text-gray-600">{{ $t('loading') }}</p>
            </div>
        </div>

        <!-- Admin form -->
        <form v-else @submit.prevent="onSubmit" class="grid grid-cols-12 gap-6">
            <!-- Left column: Avatar -->
            <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <!-- Profile image section -->
                    <div class="p-5 border-b border-neutral-200 dark:border-neutral-800">
                        <h3 class="text-lg font-semibold mb-4">{{ $t('profile_image') || 'Profile Image' }}</h3>
                        
                        <div class="flex flex-col items-center">
                            <!-- Image preview -->
                            <div v-if="previewImage" class="relative mb-4">
                                <div class="h-48 w-48 rounded-full overflow-hidden shadow-md border-4 border-white dark:border-neutral-700">
                                    <img :src="previewImage" alt="Avatar Preview" class="h-full w-full object-cover" />
                                </div>
                                <Button 
                                    icon="i-hugeicons-cancel-01" 
                                    class="absolute -top-2 -right-2 p-2 shadow-md"
                                    severity="danger" 
                                    rounded 
                                    aria-label="Remove Image" 
                                    @click="removePreview" 
                                />
                            </div>
                            
                            <!-- File uploader -->
                            <FileUpload 
                                v-else
                                :multiple="false"
                                accept="image/*"
                                :maxFileSize="3000000"
                                @select="onFileSelect"
                                customUpload
                                class="w-full"
                                :pt="{
                                    container: { class: 'w-full border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg p-6 text-center' }
                                }"
                            >
                                <template #header="{ chooseCallback, clearCallback, files }">
                                    <div class="flex justify-center gap-2">
                                        <Button 
                                            @click="chooseCallback" 
                                            icon="i-hugeicons-upload-03" 
                                            rounded
                                            outlined 
                                            severity="primary" 
                                        />
                                        <Button 
                                            @click="clearCallback()"
                                            icon="i-hugeicons-cancel-01" 
                                            rounded
                                            outlined 
                                            severity="danger"
                                            :disabled="!files || files.length === 0"
                                        />
                                    </div>
                                </template>
                                <template #empty>
                                    <div class="flex flex-col items-center p-6">
                                        <div class="flex items-center justify-center aspect-square border-2 rounded-full p-8">
                                            <i class="i-hugeicons-image-upload text-4xl text-muted-color" />
                                        </div>
                                        <p class="mt-6 mb-0">{{ $t('drag_drop_image') || 'Drag and drop files to here to upload.' }}</p>
                                    </div>
                                </template>
                            </FileUpload>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right column: Form Fields -->
            <div class="col-span-12 lg:col-span-8">
                <div class="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    <!-- Details header -->
                    <div class="bg-gray-50 dark:bg-neutral-800 p-5 border-b border-neutral-200 dark:border-neutral-700">
                        <h3 class="font-semibold text-lg">
                            {{ $t('admin_details') || 'Admin Details' }}
                        </h3>
                    </div>

                    <!-- Form fields -->
                    <div class="p-5 space-y-6">
                        <!-- Basic info fields -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Name field -->
                            <div class="flex flex-col">
                                <label for="name" class="text-sm font-medium mb-1">
                                    {{ $t('name') || 'Name' }} *
                                </label>
                                <div class="p-input-icon-left w-full">
                                    <i class="pi pi-user"></i>
                                    <InputText 
                                        id="name" 
                                        v-model="name" 
                                        :class="{ 'p-invalid': errors.name }" 
                                        class="w-full" 
                                        placeholder="Enter full name"
                                    />
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
                                    <InputText 
                                        id="email" 
                                        v-model="email" 
                                        :class="{ 'p-invalid': errors.email }" 
                                        class="w-full" 
                                        placeholder="Enter email address"
                                    />
                                </div>
                                <small class="p-error mt-1">{{ errors.email || '' }}</small>
                            </div>
                        </div>

                        <!-- Password field -->
                        <div class="flex flex-col">
                            <label for="password" class="text-sm font-medium mb-1">
                                {{ $t('password') || 'Password' }} *
                            </label>
                            <Password 
                                id="password" 
                                v-model="password" 
                                :feedback="false"
                                toggleMask
                                :class="{ 'p-invalid': errors.password }"
                                class="w-full" 
                                :pt="{
                                    input: {
                                        class: 'w-full'
                                    }
                                }"
                            />
                            <small class="p-error mt-1">{{ errors.password || '' }}</small>
                        </div>

                        <!-- Roles selection -->
                        <div class="flex flex-col">
                            <label for="roles" class="text-sm font-medium mb-1">
                                {{ $t('role.plural') || 'Roles' }} *
                            </label>
                            <MultiSelect 
                                id="roles" 
                                v-model="roles" 
                                :options="rolesData" 
                                optionLabel="name" 
                                optionValue="id"
                                :placeholder="$t('select_roles') || 'Select roles'" 
                                :class="{ 'p-invalid': errors.roles }"
                                display="chip"
                                class="w-full"
                            >
                                <template #option="slotProps">
                                    <div class="flex items-center justify-between w-full">
                                        <div>{{ slotProps.option.name }}</div>
                                        <Tag 
                                            v-if="slotProps.option.name === 'Super Admin'" 
                                            severity="danger" 
                                            value="Super" 
                                            class="text-xs"
                                        />
                                    </div>
                                </template>
                            </MultiSelect>
                            <small class="p-error mt-1">{{ errors.roles || '' }}</small>
                        </div>

                        <!-- Status toggle -->
                        <div class="flex items-center gap-2">
                            <label class="font-medium">{{ $t('account_active') || 'Account Active' }}</label>
                            <InputSwitch v-model="active" />
                        </div>

                        <!-- Action buttons -->
                        <div class="flex gap-2 justify-end pt-4 border-t border-gray-200 dark:border-neutral-700 mt-6">
                            <Button 
                                type="button"
                                @click="goBack"
                                icon="pi pi-times"
                                :label="$t('cancel') || 'Cancel'" 
                                outlined
                                :disabled="isPending"
                            />
                            <Button 
                                type="submit" 
                                icon="pi pi-check"
                                :label="$t('submit') || 'Submit'" 
                                :loading="isPending"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<route lang="yaml">
    name: Admins-add
    meta:
        layout: admin
        requiresAuth: true
</route>