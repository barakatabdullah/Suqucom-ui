<script lang="ts" setup>

import PanelMenu from 'primevue/panelmenu';
import { useI18n } from 'vue-i18n';

interface NavItem {
    label: string;
    icon: string;
    route?: string;
    items?: NavItem[];
}

const { t } = useI18n()

const settingsStore = useSettingsStore();
const navItems = ref<NavItem[]>([
    {
        label: t('dashboard'),
        icon: 'i-hugeicons-dashboard-square-01',
        route: 'AdminDashboard' as const
    },
    {
        label: t('accounts'),
        icon: 'i-hugeicons-user-sharing',
        items: [
            {
                label: t('admin.plural'),
                icon: 'i-hugeicons-manager',
                route: 'Admins' as const
            },
            {
                label: t('user.plural'),
                icon: 'i-hugeicons-user-multiple',
                route: 'Users' as const
            },
        ]
    },
    {
        label: 'Roles',
        icon: 'i-hugeicons-mentoring',
        route: 'Roles' as const
    },

    {
        label: 'Products',
        icon: 'i-hugeicons-package-open',
        items: [
            {
                label: 'All Products',
                icon: 'i-hugeicons-package-open',
                route: 'Products' as const
            },

            {
                label: t('category.plural'),
                icon: 'i-hugeicons-ellipse-selection',
                route: 'Categories' as const
            },
            {
                label: 'Attributes',
                icon: 'i-hugeicons-layers-02',
                route: 'Attributes' as const
            },

        ]
    },
    {
        label: 'Brands',
        icon: 'i-hugeicons-shopping-bag-02',
        route: 'Brands' as const
    },
    {
        label: 'Sales',
        icon: 'i-hugeicons-chart-increase',
        items: [
            {
                label: 'Orders',
                icon: 'i-hugeicons-shopping-cart-01',
                route: 'Orders' as const
            },
        ]
    },
    {
        label: 'Reviews',
        icon: 'i-hugeicons-star-square',
        items: [
            {
                label: 'Product Reviews',
                icon: 'i-hugeicons-star-square',
                route: 'Products-reviews' as const
            },
            // {
            //     label: 'Shop Reviews',
            //     icon: 'i-hugeicons-star-square',
            //     route: 'ShopReviews' as const
            // },
        ]
    },
    {
        label: 'Reports',
        icon: 'i-hugeicons-chart-histogram',
        route: 'Reports' as const
    },
    {
        label: 'Settings',
        icon: 'i-hugeicons-settings-01',
        items: [
            {
                label: 'General',
                icon: 'i-hugeicons-settings-01',
                route: 'General-settings' as const
            },

        ]

    }

])
const route = useRoute();

</script>


<template>
    <nav :class="['bg-[#F4F8FA] h-full rounded-6 flex flex-col gap-10 overflow-hidden dark:bg-primary-900',
        settingsStore.settings.isSidebarCollapsed ? 'w-26 items-center' : 'w-90 items-start'
    ]">
        <a class="w-full p-6 " href="/">
            <img class="h-14"
                :src="settingsStore.settings.isSidebarCollapsed ? '/assets/logo/icon.svg' : '/assets/logo/logo-en.svg'"
                alt="logo">
        </a>
        <div class='overflow-y-auto h-full w-full px-4'>
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
                        v-tooltip.right="settingsStore.settings.isSidebarCollapsed ? { value: item.label } : null"
                        :to="{ name: item.route }" :class="['w-full flex items-center gap-4 p-4 rounded-3 hover:bg-[#E5E7EB] dark:hover:bg-primary-800',
                            { 'bg-[#E5E7EB] dark:bg-primary-800': route.name === item.route }
                        ]">
                        <i :class="[item.icon, 'text-5']"></i>
                        <span v-if="!settingsStore.settings.isSidebarCollapsed">{{ item.label }}</span>
                    </router-link>
                    <div v-else :class="['w-full flex items-center gap-4 p-4 rounded-3 hover:bg-[#E5E7EB] dark:hover:bg-primary-800',
                        { 'bg-[#E5E7EB] dark:bg-primary-800': item.items && (item.items as NavItem[]).some((child: NavItem) => route.name === child.route) }
                    ]" v-tooltip.right="settingsStore.settings.isSidebarCollapsed ? { value: item.label } : null">
                        <i :class="[item.icon, 'text-5']"></i>
                        <span v-if="!settingsStore.settings.isSidebarCollapsed">{{ item.label }}</span>
                        <i v-if="!settingsStore.settings.isSidebarCollapsed"
                            class="i-hugeicons-arrow-down-01 ms-auto"></i>
                    </div>
                </template>
            </PanelMenu>
        </div>
    </nav>
</template>


<style scoped>
/* width */
::-webkit-scrollbar {
    width: 0.25rem;
}

/* Track */
::-webkit-scrollbar-track {
    background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #88888856;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #55555571;
}
</style>