<script lang="ts" setup>

import PanelMenu from 'primevue/panelmenu';

const layoutStore = useLayoutStore();
const navItems = ref([
    {
        label: 'Home',
        icon: 'i-hugeicons-home-01',
        route: 'Home' as const
    },
    {
        label: 'Dashboard',
        icon: 'i-hugeicons-dashboard-square-01',
        route: 'Dashboard' as const
    },
    {
        label: 'Users',
        icon: 'i-hugeicons-user-multiple',
        route: 'Users' as const
    },
    {
        label: 'Roles',
        icon: 'i-hugeicons-mentoring',
        route: 'Roles' as const
    },

    {
        label: 'Products',
        icon: 'i-hugeicons-package-open',
        // route: 'Products' as const
        items: [
            {
                label: 'All Products',
                icon: 'i-hugeicons-package-open',
                route: 'Products' as const
            },

            {
                label: 'Categories',
                icon: 'i-hugeicons-ellipse-selection',
                route: 'Categories' as const
            },

        ]
    },
    // {
    //     name: 'Settings',
    //     icon: 'i-hugeicons-settings-01',
    //     to: 'Settings' as const
    // }

])
const route = useRoute();

</script>


<template>
    <nav :class="['bg-[#F4F8FA] h-full rounded-6 flex flex-col gap-12 ',
        layoutStore.layout.isSidebarCollapsed ? 'w-26 p-4 items-center' : 'w-90 p-6 items-start'
    ]">
        <a class="w-full" href="/">
            <img class="h-14"
                :src="layoutStore.layout.isSidebarCollapsed ? '/assets/logo/icon.svg' : '/assets/logo/logo-en.svg'"
                alt="logo">
        </a>
        <PanelMenu class="w-full" :pt="{

            panel: {
                class: 'bg-transparent! border-none!'
            },
            rootList: {
                class: 'px-0! pt-2! flex! flex-col! gap-2!'
            },
        }" :model="navItems">
            <template #item="{ item }">
                <router-link v-if="item.route"
                    v-tooltip.right="layoutStore.layout.isSidebarCollapsed ? { value: item.name } : null"
                    :to="{ name: item.route }" :class="['w-full flex items-center gap-4 p-4 rounded-3 hover:bg-[#E5E7EB]',
                        { 'bg-[#E5E7EB]': route.name.includes(item.route) }
                    ]">
                    <i :class="[item.icon, 'text-5']"></i>
                    <span v-if="!layoutStore.layout.isSidebarCollapsed">{{ item.label }}</span>
                </router-link>
                <div v-else :class="['w-full flex items-center gap-4 p-4 rounded-3 hover:bg-[#E5E7EB]',
                    { 'bg-[#E5E7EB]': route.name.includes(item.route) }
                ]">
                    <i :class="[item.icon, 'text-5']"></i>
                    <span v-if="!layoutStore.layout.isSidebarCollapsed">{{ item.label }}</span>
                    <i v-if="!layoutStore.layout.isSidebarCollapsed" class="i-hugeicons-arrow-down-01 ms-auto"></i>
                </div>
            </template>
        </PanelMenu>
    </nav>
</template>
