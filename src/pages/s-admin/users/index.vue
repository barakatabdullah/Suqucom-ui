<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { getUsers } from './_utils/users';



const {data} = useQuery({
    queryKey:['users'],
    queryFn:getUsers,
    select: (data) => data.data
})

</script>

<template>
 <div class=" py-8 flex flex-col gap-4">
    <h2 class="font-bold text-5">USERS</h2>

    <DataTable class="rounded-lg border overflow-hidden" :value="data" stripedRows>
      <Column filed="name" header="Name">
        <template #body="slotProps">
          {{ slotProps.data.fname + ' ' + slotProps.data.lname }}
        </template>
      </Column>
      <Column filed="email" header="Email">
        <template #body="slotProps">
          {{ slotProps.data.email }}
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