<script lang="ts" setup>
import { getAdmin, toggleColorScheme } from '@/utils/functions'
import { useQuery } from '@tanstack/vue-query';
import type { MenuItem } from 'primevue/menuitem';
import { useI18n } from 'vue-i18n';

const { data } = useQuery<Admin>({
  queryKey: ['admin'],
  queryFn: getAdmin,
})

const adminStore = useAdminStore()

const settingsStore = useSettingsStore()

const { t } = useI18n()

const menu = ref();

const toggle = (event: any) => {
  menu.value.toggle(event);
};



const items = ref([
  {
    label: t('profile'),
    items: [
      {
        label: t('settings'),
        icon: 'pi pi-cog'
      },
      {
        label: t('logout'),
        icon: 'pi pi-sign-out',
        command: () => {
          adminStore.logout()
        }
      }
    ]
  }
]);
</script>

<template>
  <div class="w-full py-4 flex gap-6 justify-between">
    <div>
     
    </div>
    <div class="flex gap-4 items-center">
      <LanguageSwitch />
      <Button :icon="settingsStore.settings.theme === 'light' ? 'i-hugeicons-moon-02' : 'i-hugeicons-sun-01'"
        @click="toggleColorScheme" />
      <div @click="toggle" class="flex items-center gap-4 justify-between cursor-pointer min-w-12rem">

        <div class="flex items-center gap-4">
          <Avatar :image="adminStore.admin.avatar ?? undefined"
            :icon="adminStore.admin.avatar == null ? 'i-hugeicons-user' : ''"
            class="bg-primary-100 border! dark:border-neutral-700!" size="large" shape="circle" />
          <div @click="" class="flex flex-col ">
            <h1 class="text-1.2rem font-semibold text-primary-700 dark:text-primary-300">{{ adminStore.admin.name }}</h1>
            <p class="text-[0.9rem] text-gray-600">admin</p>
          </div>
        </div>
        <i class="i-hugeicons-arrow-down-01 text-primary-700 dark:text-primary-300"></i>
      </div>

      <Menu popup ref="menu" :model="items"></Menu>
    </div>
  </div>
</template>