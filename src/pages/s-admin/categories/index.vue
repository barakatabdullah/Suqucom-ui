<script lang="ts" setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { getCategories } from './_utils/categories';
import moment from 'moment';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';


const router = useRouter()
const toast = useToast();
const queryClient = useQueryClient();
const settingsStore = useSettingsStore();



const { data } = useQuery({
  queryKey: ['categories', settingsStore.settings.lang],
  queryFn: getCategories,
})

function onRowClick(row: any) {
  // router.push({ name: 'Users-id', params: { id: row.data.id } })

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
        <h2 class="font-600 text-6 text-color">Categories</h2>
        <p class="text-gray-600">You can View, Add, Edit and Remove categories</p>
      </div>

      <Button @click="() => $router.push({ name: 'Categories-add' })" label="Add Category" />
    </div>

    <div class="h-full overflow-y-auto">
      <DataTable :pt="{
        bodyRow: {
          class: 'cursor-pointer'
        }
      }" class="rounded-lg border overflow-hidden" rowHover @rowClick="onRowClick" :value="data">
        <Column filed="name" header="Name">
          <template #body="slotProps">
            {{ slotProps.data.name }}
          </template>
        </Column>

        <Column filed="slug" header="Slug">
          <template #body="slotProps">
            {{ slotProps.data.slug }}
          </template>
        </Column>
        <Column filed="active" header="Active">
          <template #body="slotProps">
            {{ slotProps.data.active ? 'Yes' : 'No' }}
          </template>
        </Column>
        <Column filed="published" header="Published">
          <template #body="slotProps">
            {{ slotProps.data.published ? 'Yes' : 'No' }}
          </template>
        </Column>
        <Column filed="order" header="Order">
          <template #body="slotProps">
            {{ slotProps.data.order }}
          </template>
        </Column>

        <Column filed="created_at" header="Created at">
          <template #body="slotProps">
            {{ moment(slotProps.data.created_at).format("MMM Do YY") }}
          </template>
        </Column>

        <Column filed="image" header="Image">
          <template #body="slotProps">
            <img :src="slotProps.data.image" alt="" class="w-12 h-12 rounded-full" />
          </template>
        </Column>

        <Column filed="edit">
          <template #body="slotProps">
            <Button
              @click="() => $router.push({ name: 'Users-id', params: { id: slotProps.data.id }, query: { mode: 'edit' } })"
              icon="i-heroicons-pencil-square" text />
          </template>
        </Column>
        <Column filed="remove">
          <template #body="slotProps">
            <Button icon="i-heroicons-trash" text severity="danger" />
          </template>
        </Column>






      </DataTable>
    </div>
  </div>
</template>


<route lang="yaml">
  name: Categories
  meta:
    layout: admin
    requiresAuth: true

</route>