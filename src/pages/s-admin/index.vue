<script lang="ts" setup>
import { toggleColorScheme, changeLanguage } from '@/utils/functions'
import Select from 'primevue/select'

const settingsStore = useSettingsStore()


</script>


<template>
  Dashboard
  <Button
    label="Toggle"

    @click="settingsStore.toggleSidebar"
  />

  <h4>{{ $t('hello') }}</h4>



</template>

<route lang="yaml">
name: Dashboard
meta:
layout: admin
requiresAuth: true
</route>