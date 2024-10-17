<script lang="ts" setup>
import { toggleColorScheme,setI18nLanguage } from '@/utils/functions'
import Select from 'primevue/select';
const layoutStore = useLayoutStore();




</script>


<template>
    Dashboard
    <Button
    label="Toggle"

    @click="layoutStore.toggleSidebar"
    />

    <h4>{{ $t('hello') }}</h4>
    <Button :label="$t('toggleColorTheme')" @click="toggleColorScheme" />

    <Select v-model="$i18n.locale" :options="$i18n.availableLocales" @change="(event)=>setI18nLanguage(event.value)" :placeholder="$t('language')">
      <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center">
                    <div>{{ slotProps.value==='en' ? "English":"Arabic" }}</div>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>

            <template #option="slotProps">
                <div class="flex items-center">
                    <div>{{ slotProps.option ==='en' ? "English":"Arabic" }}</div>
                </div>
            </template>
    </Select>
</template>

<route lang="yaml">
    name: Dashboard
    meta:
      layout: admin
      requiresAuth: true
</route>