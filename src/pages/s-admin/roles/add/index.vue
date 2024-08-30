<script lang="ts" setup>

import { useQueryClient, useMutation, useQuery } from '@tanstack/vue-query';
import * as zod from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import api from '@/config/axios';

import Toast from 'primevue/toast';

import ToggleSwitch from 'primevue/toggleswitch';


import { useToast } from 'primevue/usetoast';
import { getAllPermissions } from '@/_utils';
import { r } from 'node_modules/unplugin-vue-router/dist/options-ChnxZdan.mjs';


const route = useRoute()
const router = useRouter()
const roleId = (route.params as { id: number }).id;



// const { data } = useQuery({
//     queryKey: ['role', roleId],
//     queryFn: () => getRoleById(roleId),
//     select: (data) => data.data,

// })

const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: getAllPermissions,
    select: (data) => data.data,
});



const toast = useToast();
const queryClient = useQueryClient();

const UserSchema = toTypedSchema(
    zod.object({
        name: zod.string().min(2, { message: 'First name must be at least 2 characters' }),
        guard_name: zod.string().min(2, { message: 'Last name must be at least 2 characters' }),
    })
)

const { defineField, handleSubmit, errors, resetForm, setValues } = useForm({
    validationSchema: UserSchema,
})

const allSelected = ref(false);



const [name] = defineField('name');
const [guard_name] = defineField('guard_name');
const selectedPermissions = ref<boolean[]>([]);


watchEffect(() => {
    if (allSelected.value) {
        selectedPermissions.value = permissions.value.map(() => true)
    }
})

setValues({
    guard_name: 'api',

});



// Mutation
const { mutateAsync } = useMutation({
    mutationFn: async (data: any) => {
        const res = await api
            .post('roles/', {
                name: data.name,
                guard_name: data.guard_name,
                permission_ids: permissions.value
                    .filter((permission: any, index: number) => selectedPermissions.value?.[index])
                    .map((permission: any) => permission.id),

            })
            .then((res) => res.data)
        return res
    },
    onSuccess: (res) => {
        toast.add({ severity: 'info', summary: 'Success', detail: 'Role Created successfully', life: 3000 });
        queryClient.invalidateQueries(['roles', 'role']);
        router.push({ name: 'Roles-id', params: { id: res.data.id } })
    },
    onError: (error) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    }
})

const onSubmit = handleSubmit((values) => {
    mutateAsync(values)
})

</script>


<template>
    <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6">
        <Toast />
        <div class="w-full flex items-center justify-between">
            <div class="flex flex-col gap-2 items-start">
                <h2 class="font-600 text-6 text-color">Add Role</h2>
                <p class="text-gray-600">You can View, Add role</p>
            </div>
        </div>
        <form @submit="onSubmit" class="w-full h-full flex flex-col gap-6 overflow-hidden">
            <div class="border rounded-4 w-full p-4 flex gap-6">
                <div class="flex flex-col gap-1 w-full">
                    <label class="text-[#4b465c82] text-3.5 font-semibold" for="name">Name</label>
                    <InputText v-model="name" :class="{ 'p-invalid': errors.name }" />
                    <span v-if="errors.name" class="text-red-500">{{ errors.name }}</span>
                </div>
                <div class="flex flex-col gap-1 w-full">
                    <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">Guard Name</label>
                    <InputText v-model="guard_name" disabled :class="{ 'p-invalid': errors.guard_name }" />
                    <span v-if="errors.guard_name" class="text-red-500">{{ errors.guard_name }}</span>
                </div>

                <div class="flex flex-col justify-center gap-1 w-full">
                    <div class="flex items-center gap-2">
                        <label>Select All</label>
                        <ToggleSwitch v-model="allSelected" />
                    </div>
                    <p>Enable all Permissions currently Enabled for this role</p>

                </div>
            </div>
            <div class="border rounded-4 flex flex-col gap-4 w-full h-full p-4 flex gap-6 overflow-hidden">
                <div class="h-full grid grid-cols-3 gap-6 overflow-y-auto">
                    <div class="col-span-3 flex flex-col gap-2 items-start">
                        <h4 class="font-600 text-5 text-color">Permissions</h4>
                    </div>

                    <div v-for="(permission, index) in permissions"
                        class="border p-4 rounded-4 flex gap-4 justify-between">

                        <label class="flex items-center gap-2" :for="'permission' + index"><i
                                class="i-hugeicons-stop"></i> {{ permission.name }} </label>
                        <ToggleSwitch :id="'permission' + index" v-model="selectedPermissions[index]" />
                    </div>

                </div>
            </div>
            <Button label="Save" type="submit" />
        </form>
    </div>
</template>




<route lang="yaml">
    name: Roles-add
    meta:
      layout: admin
      requiresAuth: true
  </route>