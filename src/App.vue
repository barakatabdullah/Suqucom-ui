<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { getUser, initTheme } from '@/utils/functions'
import { loadLanguageAsync } from '@/utils/functions';
loadLanguageAsync(localStorage.getItem('lang') ?? 'en')
initTheme()
</script>

<template>
    <RouterView />

</template>
