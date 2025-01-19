<script lang="ts" setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { deleteAdmin, getAdmins } from './_utils/admins';
import moment from 'moment';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';


const router = useRouter()
const toast = useToast();
const queryClient = useQueryClient();



const { data } = useQuery({
  queryKey: ['admins'],
  queryFn: getAdmins,
  select: (data) => data.data
})

function onRowClick(row: any) {
  router.push({ name: 'Admins-id', params: { id: row.data.id } })

}

const { mutateAsync:removeMutate } = useMutation({
    mutationFn: async (id:number) => {
        await deleteAdmin(id);
    },
    onSuccess: () => {
        toast.add({ severity: 'info', summary: 'Success', detail: 'User deleted successfully', life: 3000 });
        queryClient.invalidateQueries({queryKey:['admins']});
    },
    onError: (error) => {
        toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    }
})

</script>

<template>
  <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6 dark:border-neutral-800">
    <Toast/>
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-2 items-start">
        <h2 class="font-600 text-6 text-color uppercase">{{ $t('admin.plural') }}</h2>
        <p class="text-gray-600">{{ $t('admin.discrption') }}</p>
      </div>

      <Button  @click="()=>$router.push({name:'Admins-add'})" :label="$t('add',{name:$t('admin.singular')})"
         />
    </div>

<div class="h-full overflow-y-auto">
  <DataTable
  :pt="{
    bodyRow:{
      class:'cursor-pointer'
    }
    }"
  
  class="rounded-lg border overflow-hidden" rowHover @rowClick="onRowClick" :value="data">
      <Column filed="avatar" header="Avatar">
        <template #body="slotProps">
          <Avatar :pt="{
            root:{
              class:'overflow-hidden'
            },
            image:{
              class:'object-cover'
            }
          }" :image="slotProps.data.media[0]?.preview_url" size="xlarge" />
        </template>
      </Column>
      <Column filed="name" header="Name">
        <template #body="slotProps">
          {{ slotProps.data.name }}
        </template>
      </Column>
      <Column filed="role" header="Role">
        <template #body="slotProps">
          <Tag :value="slotProps.data.roles.length > 0 ? slotProps.data.roles[0].name : ''" />
        </template>
      </Column>
      <Column filed="email" header="Email">
        <template #body="slotProps">
          {{ slotProps.data.email }}
        </template>
      </Column>


      <Column filed="created_at" header="Joind at">
        <template #body="slotProps">
          {{ moment(slotProps.data.created_at).format("MMM Do YY") }}
        </template>
      </Column>

      <Column filed="edit" >
        <template #body="slotProps">
          <Button
          @click="()=>$router.push({name:'Users-id', params: { id: slotProps.data.id }, query: { mode: 'edit' }})"
          icon="i-heroicons-pencil-square"
          text
          />
        </template>
      </Column>
      <Column filed="remove" >
        <template #body="slotProps">
          <Button
          @click="removeMutate(slotProps.data.id)"
          icon="i-heroicons-trash"
          text
          severity="danger"
          />
        </template>
      </Column>






    </DataTable>
</div>
  </div>
</template>

<route lang="yaml">
    name: Admins
    meta:
      layout: admin
      requiresAuth: true
</route>