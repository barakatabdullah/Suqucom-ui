<script lang="ts" setup>
import { getUser } from '@/utils/functions';
import moment from 'moment';
import { getUserbyId } from './_utils/users';
import { useQueryClient, useMutation, useQuery } from '@tanstack/vue-query';
import * as zod from 'zod'
import { getAllPermissions, getAllRoles } from '@/utils/functions';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import Image from 'primevue/image';


import Select from 'primevue/select';
import api from '@/config/axios';

import Toast from 'primevue/toast';

import { useToast } from 'primevue/usetoast';


const route = useRoute()
const userId = (route.params as { id: number }).id;

const mode = ref<'view' | 'edit'>(route.query.mode as 'view' | 'edit' ?? 'view')

function toggleMode() {
    mode.value = mode.value === 'view' ? 'edit' : 'view'
}


const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserbyId(userId),
    select: (data) => data.data,

})



const toast = useToast();
const queryClient = useQueryClient();

const UserSchema = toTypedSchema(
    zod.object({
        fname: zod.string().min(2, { message: 'First name must be at least 2 characters' }),
        lname: zod.string().min(2, { message: 'Last name must be at least 2 characters' }),
        email: zod.string().email({ message: 'Invalid Email' }),
        role: zod.number().refine((value) => value >= 0, { message: 'Role must be selected' }),
    })
)

const { defineField, handleSubmit, errors, resetForm, setValues } = useForm({
    validationSchema: UserSchema,
})

const [fname] = defineField('fname');
const [lname] = defineField('lname');
const [email] = defineField('email');
const [role] = defineField('role');
const fileupload = ref();






watchEffect(() => {
    if (data.value) {
        setValues({
            fname: data.value.fname,
            lname: data.value.lname,
            email: data.value.email,
            role: data.value.roles[0]?.id,
        });
    }
})


// Mutation
const { mutateAsync } = useMutation({
    mutationFn: async (data: any) => {
        const res = await api
            .post('users/'+userId, {
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            password: data.password,
            role: data.role,
            avatar: fileupload.value.files[0],
            _method: "put"
            
            }, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then((res) => res.data)
        return res
    },
    onSuccess: () => {
        toast.add({ severity: 'info', summary: 'Success', detail: 'User Updated successfully', life: 3000 });
        queryClient.invalidateQueries({ queryKey: ['users', 'user'] });
    },
    onError: (error) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    }
})

const onSubmit = handleSubmit((values) => {
    mutateAsync(values)
})




// const { data: permissions } = useQuery({
//     queryKey: ['permissions'],
//     queryFn: getAllPermissions,
// });

const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    select: (data) => data.data,
});


</script>


<template>
    <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6">
        <Toast />
        <div class="w-full flex items-center justify-between">
            <div class="flex flex-col gap-2 items-start">
                <h2 class="font-600 text-6 text-color">{{ mode === 'view' ? "View" : "Edit" }} User</h2>
                <p class="text-gray-600">You can View, Edit and Remove user</p>
            </div>

            <Button @click="toggleMode" :label="mode === 'view' ? 'Edit' : 'View'" />
        </div>
        <form v-if="data" @submit="onSubmit" class="w-full h-full grid grid-cols-8 gap-8 max-lg:grid-cols-1">
            <div class="aspect-square col-span-2 max-lg:col-span-1 relative">

                <FileUpload v-if="mode === 'edit'" :pt="{
                    root: {
                        class: 'h-full flex flex-col rounded-6!'
                    },
                    content: {
                        class: 'h-full'
                    },
                    empty: {
                        class: 'h-full '
                    }

                }" class="h-full" ref="fileupload" name="demo[]" accept="image/*" :maxFileSize="2000000" customUpload>
                    <template #header="{ chooseCallback, clearCallback, files }">
                        <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                            <div class="flex gap-2">
                                <Button @click="chooseCallback" icon="i-hugeicons-upload-03" rounded outlined
                                    severity="primary" />

                                <Button @click="clearCallback()" icon="i-hugeicons-cancel-01" rounded outlined
                                    severity="danger" :disabled="!files || files.length === 0"></Button>
                            </div>
                        </div>
                    </template>

                    <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                        <div class="flex flex-col gap-8 pt-4">
                            <div v-if="files.length > 0">
                                <h5>Pending</h5>
                                <div class="flex flex-wrap gap-4">
                                    <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
                                        class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                        <div>
                                            <img role="presentation" :alt="file.name" :src="file.objectURL" width="100"
                                                height="50" />
                                        </div>
                                        <span
                                            class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                                                file.name }}</span>
                                        <!-- <div>{{ formatSize(file.size) }}</div> -->
                                        <Badge value="Pending" severity="warn" />
                                        <!-- <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" /> -->
                                    </div>
                                </div>
                            </div>

                            <div v-if="uploadedFiles.length > 0">
                                <h5>Completed</h5>
                                <div class="flex flex-wrap gap-4">
                                    <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size"
                                        class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                        <div>
                                            <img role="presentation" :alt="file.name" :src="file.objectURL" width="100"
                                                height="50" />
                                        </div>
                                        <span
                                            class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                                                file.name }}</span>

                                        <Badge value="Completed" class="mt-4" severity="success" />
                                        <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined
                                            rounded severity="danger" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <div class="flex h-full items-center justify-center flex-col">
                            <div class="flex items-center justify-center aspect-square border-2 rounded-full p-8">
                                <i class="i-hugeicons-image-upload text-4xl text-muted-color" />
                            </div>
                            <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                        </div>
                    </template>
                </FileUpload>


                <div v-else-if="mode === 'view' && data"
                    class="flex flex-col border rounded-6 overflow-hidden  w-full gap-2 h-full">
                    <img class="w-full h-full object-cover " :src="data.media[0]?.preview_url" alt="avatar" />

                </div>


            </div>

            <div class="col-span-6 flex flex-col gap-6 max-lg:col-span-1">
                <div v-if="mode === 'edit'" class="grid grid-cols-2 gap-6">
                    <div class="flex flex-col gap-1">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">First Name</label>
                        <InputText v-model="fname" :class="{ 'p-invalid': errors.fname }" />
                        <span v-if="errors.fname" class="text-red-500">{{ errors.fname }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="lname">Last Name</label>
                        <InputText v-model="lname" :class="{ 'p-invalid': errors.lname }" />
                        <span v-if="errors.lname" class="text-red-500">{{ errors.lname }}</span>
                    </div>
                    <div class="flex flex-col gap-1 col-span-2">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="email">Email</label>
                        <InputText id="email" v-model="email" :class="{ 'p-invalid': errors.email }" />
                        <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="role">Role</label>
                        <Select v-model="role" :options="roles" optionLabel="name" optionValue="id"
                            placeholder="select a role" :class="{ 'p-invalid': errors.role }" />
                        <span v-if="errors.role" class="text-red-500">{{ errors.role }}</span>
                    </div>
                    <Button class="col-span-2" type="submit" label="Edit" />


                </div>

                <div v-else-if="mode ==='view'" class="grid grid-cols-2 gap-6">
                    <div class="flex flex-col gap-1">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">First Name</label>
                            <div>{{ fname }}</div>

                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="lname">Last Name</label>
                        <div>{{ lname }}</div>
                    </div>
                    <div class="flex flex-col gap-1 col-span-2">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="email">Email</label>
                        <div>{{ email }}</div>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="role">Role</label>
                        <div>{{ data?.roles[0]?.name }}</div>
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
