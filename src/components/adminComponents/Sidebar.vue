<script lang="ts" setup>
const layoutStore = useLayoutStore();
const navItems = [
    {
        name: 'Home',
        icon: 'i-hugeicons-home-01',
        to: 'Home' as const
    },
    {
        name: 'Dashboard',
        icon: 'i-hugeicons-dashboard-square-01',
        to: 'Dashboard' as const
    },
    {
        name: 'Users',
        icon: 'i-hugeicons-user-multiple',
        to: 'Users' as const
    },
    {
        name: 'Roles',
        icon: 'i-hugeicons-mentoring',
        to: 'Roles' as const
    },
    // {
    //     name: 'Settings',
    //     icon: 'i-hugeicons-settings-01',
    //     to: 'Settings' as const
    // }

];
const route = useRoute();

</script>


<template>
    <nav :class="['bg-[#F9FAFB] h-full rounded-6',
        layoutStore.layout.isSidebarCollapsed ? 'w-26' : 'w-120'
    ]">
        <div class="w-full h-full p-6 flex flex-col gap-12 items-center">
            <a class="w-full" href="/">
                <img class="h-14"
                    :src="layoutStore.layout.isSidebarCollapsed ? '/assets/logo/icon.svg' : '/assets/logo/logo-en.svg'"
                    alt="logo">
            </a>

            <div class="w-full flex flex-col gap-4 items-center">
                <router-link v-for="item in navItems" :key="item.to"
                    v-tooltip.right="layoutStore.layout.isSidebarCollapsed ? { value: item.name } : null"
                    :to="{ name: item.to }" :class="['w-full flex items-center gap-4 p-4 rounded-3 hover:bg-[#E5E7EB]',
                        { 'bg-[#E5E7EB]':   route.name.includes(item.to) }
                    ]">
                    <i :class="[item.icon, 'text-5']"></i>
                    <span v-if="!layoutStore.layout.isSidebarCollapsed">{{ item.name }}</span>
                </router-link>
            </div>
        </div>


    </nav>
</template>
