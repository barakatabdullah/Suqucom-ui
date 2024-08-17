<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { getUsers } from './_utils/users';
import moment from 'moment';


const router = useRouter()



const { data } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  select: (data) => data.data
})

function onRowClick(data: any) {
  router.push({ name: 'Users-id', params: { id: data.value.id } })
}

</script>

<template>
  <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6">
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-2 items-start">
        <h2 class="font-600 text-6 text-color">USERS</h2>
        <p class="text-gray-600">You can View, Add, Edit and Remove users</p>
      </div>

      <Button  @click="()=>$router.push({name:'Users-add'})" label="Add User" />
    </div>

    <DataTable class="rounded-lg border overflow-hidden" rowHover @row-click="onRowClick" :value="data">
      <Column filed="avatar" header="Avatar">
        <template #body="slotProps">
          <Avatar :pt="{
            root:{
              class:'overflow-hidden'
            },
            image:{
              class:'object-cover'
            }
          }" :image="slotProps.data.avatar" size="xlarge" />
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
          @click="()=>$router.push({name:'Users-add'})"
          icon="i-heroicons-trash"
          text
          severity="danger"
          />
        </template>
      </Column>






    </DataTable>
  </div>
</template>

<route lang="yaml">
    name: Users
    meta:
      layout: admin
      requiresAuth: true
</route>