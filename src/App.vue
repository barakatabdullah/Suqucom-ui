<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { getUser } from './_utils';


 const {data}=useQuery({
    queryKey:['user'],
    queryFn: getUser
 })

 console.log(data.value)




</script>

<template>
<RouterView/>
</template>

