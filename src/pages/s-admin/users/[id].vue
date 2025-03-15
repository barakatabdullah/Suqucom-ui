<script lang="ts" setup>
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { getUserbyId, updateUser } from './_utils/users';
import moment from 'moment/min/moment-with-locales';
import * as zod from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from 'primevue/confirmdialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
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

// Get user ID from route params
const userId = ref()

onMounted(() => {
    if ("id" in route.params) userId.value = route.params.id;
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

// Fetch user data with better error handling
const { data: userData, isLoading: isLoadingUser, isError: isUserError } = useQuery({
    queryKey: ['user', userId.value],
    queryFn: () => getUserbyId(userId.value),
});



// Form validation schema
const UserSchema = toTypedSchema(
    zod.object({
        fname: zod
            .string()
            .min(2, { message: t('validation.fname_min_length') || 'First name must be at least 2 characters' }),
        lname: zod
            .string()
            .min(2, { message: t('validation.lname_min_length') || 'Last name must be at least 2 characters' }),
        email: zod
            .string()
            .email({ message: t('validation.email_invalid') || 'Invalid email address' }),
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
    validationSchema: UserSchema,
    initialValues: {
        fname: '',
        lname: '',
        email: '',
        // active: true,
        password: ''
    }
});

const [fname] = defineField('fname');
const [lname] = defineField('lname');
const [email] = defineField('email');
const [active] = defineField('active');
const [password] = defineField('password');

// Set form values when user data loads
watchEffect(() => {
    if (userData.value) {
        setValues({
            fname: userData.value.fname,
            lname: userData.value.lname,
            email: userData.value.email,
            // active: userData.value.active || true,
            password: ''
        });
        if (userData.value.avatar && !previewImage.value) {
            previewImage.value = userData.value.avatar;
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

// Update user mutation
const { mutate: updateUserMutation, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
        const { data } = await updateUser(userId.value, formData);
        return data;
    },
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: t('success') || 'Success',
            detail: t('success.user_update_success'),
            life: 3000
        });
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        mode.value = 'view'; // Switch back to view mode after successful update
    },
    onError: (error: any) => {
        toast.add({
            severity: 'error',
            summary: t('error') || 'Error',
            detail: error.response?.data?.message || t('errors.user_update_failed'),
            life: 5000
        });
    }
});

const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.append('fname', values.fname);
    formData.append('lname', values.lname);
    formData.append('email', values.email);
    formData.append('active', String(values.active));

    if (values.password) {
        formData.append('password', values.password);
    }


    // Handle avatar if uploaded
    if (selectedFile.value) {
        formData.append('avatar', selectedFile.value);
    } else if (previewImage.value === null && userData.value?.avatar) {
        // If preview was cleared, and there was an avatar before
        formData.append('remove_avatar', '1');
    }

    // Use the mutation
    updateUserMutation(formData);
});

// Confirm before navigating away
onBeforeRouteLeave((to, from, next) => {
    if (mode.value === 'edit' && isFormDirty.value) {
        confirm.require({
            group: 'back',
            message: t('confirmations.unsaved_changes') || 'You have unsaved changes. Are you sure you want to leave?',
            header: t('confirmations.confirm_navigation') || 'Confirm Navigation',
            icon: 'i-hugeicons-alert-02',
            acceptLabel: t('confirmations.yes') || 'Yes',
            rejectLabel: t('confirmations.no') || 'No',
            accept: () => next(),
            reject: () => next(false)
        });
    } else {
        next();
    }
});

// Track if form is dirty (has changes)
const isFormDirty = computed(() => {
    if (!userData.value) return false;

    // Compare current form values with original data
    return (
        values.fname !== userData.value.fname ||
        values.lname !== userData.value.lname ||
        values.email !== userData.value.email ||
        values.active !== userData.value.active ||
        values.password !== '' ||
        selectedFile.value !== null || // Check if a new file was selected
        (previewImage.value === null && userData.value.avatar) // Check if avatar was removed
    );
});

// Function to go back to user list
function goBack() {
    router.push({ name: 'Users' });
}

// Define translation fallbacks for missing keys
const viewText = computed(() => t('view') || 'View');
const editText = computed(() => t('edit') || 'Edit');
const userDesc = computed(() => t('user.description') || 'Manage user details');
</script>

<template>
    <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6 dark:border-neutral-800">
        <Toast />
        <ConfirmDialog group="back">
            <template #message="slotProps">
                <div class="flex flex-col items-center w-full gap-4">
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
                        {{ mode === 'view' ? viewText : editText }} {{ $t('user.singular') || 'User' }}
                    </h2>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                    {{ userDesc }}
                </p>
            </div>

            <div class="flex gap-2">
                <Button @click="toggleMode" :label="mode === 'view' ? editText : viewText"
                    :icon="mode === 'view' ? 'i-hugeicons-pen-01' : 'i-hugeicons-view'"
                    :severity="mode === 'view' ? 'primary' : 'secondary'" />
            </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoadingUser" class="flex justify-center items-center py-16">
            <div class="flex flex-col items-center">
                <ProgressSpinner style="width: 50px; height: 50px" />
                <p class="mt-4 text-gray-600">{{ $t('loading_user') || 'Loading user information...' }}</p>
            </div>
        </div>

        <!-- Error state -->
        <div v-else-if="isUserError" class="flex flex-col items-center justify-center p-8">
            <div
                class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl p-6 max-w-md text-center">
                <i class="i-hugeicons-alert-02 text-4xl mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">{{ $t('errors.failed_to_load_user_data') }}</h3>
                <p class="mb-4">{{ $t('errors.user_load_error') }}</p>
                <Button :label="$t('try_again')" icon="i-hugeicons-refresh"
                    @click="() => queryClient.invalidateQueries({ queryKey: ['user', userId.value] })"
                    severity="danger" />
            </div>
        </div>

        <!-- User data -->
        <form v-else-if="userData" @submit.prevent="onSubmit" class="grid grid-cols-12 gap-6">
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
                                <img v-if="userData.avatar" :src="userData.avatar"
                                    :alt="`${userData.fname} ${userData.lname}`" class="h-full w-full object-cover" />
                                <div v-else
                                    class="h-full w-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                                    <i class="i-hugeicons-user-02 text-4xl text-gray-400"></i>
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
                                        <p class="mt-6 mb-0">{{ $t('drag_drop_image') || 'Drag and drop files to here to upload.' }}</p>
                                    </div>
                                </template>
                            </FileUpload>
                        </div>
                    </div>

                    <!-- User information section -->
                    <div v-if="mode === 'view'" class="p-5">
                        <h3 class="text-lg font-semibold mb-4">{{ $t('account_info') || 'Account Info' }}</h3>

                        <div class="space-y-3">
                            <!-- Account created date -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <i class="i-hugeicons-calendar-03 text-gray-500"></i>
                                    <span class="text-gray-600 dark:text-gray-400">
                                        {{ $t('joined') || 'Joined' }}
                                    </span>
                                </div>
                                <div class="font-medium">
                                    {{ moment(userData.created_at).locale(settingsStore.settings.lang).format("LL") }}
                                </div>
                            </div>

                            <!-- Account status -->
                            <!-- <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-user text-gray-500"></i>
                                    <span class="text-gray-600 dark:text-gray-400">
                                        {{ $t('status') || 'Status' }}
                                    </span>
                                </div>
                                <Tag :severity="userData.active ? 'success' : 'danger'"
                                    :value="userData.active ? ($t('active') || 'Active') : ($t('inactive') || 'Inactive')" />
                            </div> -->


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
                            {{ mode === 'view' ? $t('user_details') : $t('edit_user') }}
                        </h3>
                    </div>

                    <!-- Content area -->
                    <div class="p-5">
                        <!-- View mode -->
                        <div v-if="mode === 'view'" class="space-y-6">
                            <!-- Basic info section -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- First Name -->
                                <div class="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <div class="text-sm text-gray-500 mb-1">{{ $t('first_name') || 'First Name' }}</div>
                                    <div class="text-lg font-medium">{{ userData.fname }}</div>
                                </div>

                                <!-- Last Name -->
                                <div class="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                    <div class="text-sm text-gray-500 mb-1">{{ $t('last_name') || 'Last Name' }}</div>
                                    <div class="text-lg font-medium">{{ userData.lname }}</div>
                                </div>

                                <!-- Email -->
                                <div class="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg col-span-2">
                                    <div class="text-sm text-gray-500 mb-1">{{ $t('email') || 'Email' }}</div>
                                    <div class="text-lg font-medium">{{ userData.email }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Edit mode -->
                        <div v-else class="space-y-6">
                            <!-- Basic info fields -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- First Name field -->
                                <div class="flex flex-col">
                                    <label for="fname" class="text-sm font-medium mb-1">
                                        {{ $t('first_name') }} *
                                    </label>
                                    <div class="p-input-icon-left w-full">
                                        <i class="i-hugeicons-user-02"></i>
                                        <InputText id="fname" v-model="fname" :class="{ 'p-invalid': errors.fname }"
                                            class="w-full" placeholder="Enter first name" />
                                    </div>
                                    <small class="p-error mt-1">{{ errors.fname || '' }}</small>
                                </div>

                                <!-- Last Name field -->
                                <div class="flex flex-col">
                                    <label for="lname" class="text-sm font-medium mb-1">
                                        {{ $t('last_name') }} *
                                    </label>
                                    <div class="p-input-icon-left w-full">
                                        <i class="i-hugeicons-user-02"></i>
                                        <InputText id="lname" v-model="lname" :class="{ 'p-invalid': errors.lname }"
                                            class="w-full" placeholder="Enter last name" />
                                    </div>
                                    <small class="p-error mt-1">{{ errors.lname || '' }}</small>
                                </div>

                                <!-- Email field -->
                                <div class="flex flex-col col-span-2">
                                    <label for="email" class="text-sm font-medium mb-1">
                                        {{ $t('email') || 'Email' }} *
                                    </label>
                                    <IconField>
                                        <InputIcon class="i-hugeicons-mail-01"/>
                                        <InputText id="email" v-model="email" :class="{ 'p-invalid': errors.email }"
                                            class="w-full" placeholder="Enter email address" />
                                    </IconField>
                                    <small class="p-error mt-1">{{ errors.email || '' }}</small>
                                </div>
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

                            <!-- Status toggle -->
                            <!-- <div class="flex items-center gap-2">
                                <label class="font-medium">{{ $t('account_active') || 'Account Active' }}</label>
                                <InputSwitch v-model="active" />
                            </div> -->

                            <!-- Action buttons -->
                            <div
                                class="flex gap-2 justify-end pt-4 border-t border-gray-200 dark:border-neutral-700 mt-6">
                                <Button type="button" @click="mode = 'view'" icon="i-hugeicons-cancel-01"
                                    :label="$t('cancel') || 'Cancel'" outlined :disabled="isPending" />
                                <Button type="submit" icon="i-hugeicons-sent" :label="$t('save_changes') || 'Save Changes'"
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
    name: Users-id
    meta:
        layout: admin
        requiresAuth: true
</route>