<script setup lang="ts">

import { changeLanguage } from '@/utils/functions'
import Select from 'primevue/select'


const customSelectTheme = ref({
  colorScheme: {
    light: {
      root: {
        background: '{surface.100}',
        hoverBackground: '{surface.200}',
        border: {
          color: '{surface.200}',
          hover: '{surface.300}',
        },
      },
    },
    dark: {
      root: {
        background: '{surface.800}',
        hoverBackground: '{surface.700}',
        border: {
          color: 'none',
        },
      },
    },
  },
});

</script>

<template>
  <Select
    :pt="{
      dropdown:{
        class: 'hidden!'
      }
      }"
    class="aspect-square max-h-2.71rem hover:bg-primary-200!"
    :dt="customSelectTheme"
    v-model="$i18n.locale" :options="$i18n.availableLocales"
    @change="(event)=>changeLanguage(event.value)" :placeholder="$t('language')">
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center h-full w-full">
        <div>{{ slotProps.value === 'en' ? 'EN' : 'AR' }}</div>
      </div>
      <span v-else>
                    {{ slotProps.placeholder }}
                </span>
    </template>

    <template #option="slotProps">
      <div class="flex items-center">
        <div>{{ slotProps.option === 'en' ? 'English' : 'Arabic' }}</div>
      </div>
    </template>
  </Select>
</template>
