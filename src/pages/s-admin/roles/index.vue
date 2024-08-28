<script lang="ts" setup>
import { getAllRoles } from '@/_utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import moment from 'moment';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';


const router = useRouter()
const toast = useToast();
const queryClient = useQueryClient();


const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
    select: (data) => data.data,
});


function onRowClick(row: any) {
    //   router.push({ name: 'Users-id', params: { id: row.data.id } })

}

// const { mutateAsync:removeMutate } = useMutation({
//     mutationFn: async (id:number) => {
//         await deleteUser(id);
//     },
//     onSuccess: () => {
//         toast.add({ severity: 'info', summary: 'Success', detail: 'User deleted successfully', life: 3000 });
//         queryClient.invalidateQueries(['users']);
//     },
//     onError: (error) => {
//         toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
//     }
// })

</script>

<template>
    <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6">
        <Toast />
        <div class="w-full flex items-center justify-between">
            <div class="flex flex-col gap-2 items-start">
                <h2 class="font-600 text-6 text-color">Roles</h2>
                <p class="text-gray-600">You can View, Add, Edit and Remove roles</p>
            </div>

            <Button @click="" label="Add Role" />
        </div>

        <div class="h-full overflow-y-auto">
            <DataTable :pt="{
                bodyRow: {
                    class: 'cursor-pointer'
                }
            }" class="rounded-lg border overflow-hidden" rowHover @rowClick="onRowClick" :value="roles">
                <Column filed="name" header="Name">
                    <template #body="slotProps">
                        {{ slotProps.data.name }}
                    </template>

                </Column>
                <Column filed="guard_name" header="Guard Name">
                    <template #body="slotProps">
                        <Badge :value="slotProps.data.guard_name" />
                    </template>
                </Column>


                <Column filed="created_at" header="Created at">
                    <template #body="slotProps">
                        {{ moment(slotProps.created_at).format("MMM Do YY") }}
                    </template>
                </Column>

                <Column filed="edit">
                    <template #body="slotProps">
                        <Button @click="" icon="i-heroicons-pencil-square" text />
                    </template>
                </Column>
                <Column filed="remove">
                    <template #body="slotProps">
                        <Button @click="" icon="i-heroicons-trash" text severity="danger" />
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