<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { getUser } from '@/utils/functions';
import { loadLanguageAsync } from '@/utils/functions';


loadLanguageAsync(localStorage.getItem('lang') ?? 'en')


const { data } = useQuery({
    queryKey: ['user'],
    queryFn: getUser
})



</script>

<template>
    <RouterView />

</template>
