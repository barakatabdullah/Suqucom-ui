<script lang="ts" setup>

const layoutStore = useLayoutStore();

</script>


<template>
    Dashboard
    <Button
    label="Toggle"

    @click="layoutStore.toggleSidebar"
    />
</template>

<route lang="yaml">
    name: Dashboard
    meta:
      layout: admin
      requiresAuth: true
</route>