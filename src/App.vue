<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { getUser, initTheme } from '@/utils/functions'
import { setI18nLanguage } from '@/utils/functions';
setI18nLanguage(localStorage.getItem('lang') ?? 'en')
initTheme()
</script>

<template>
    <RouterView />

</template>
