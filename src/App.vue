<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { getUser, initTheme } from "@/utils/functions";
import { setI18nLanguage } from "@/utils/functions";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { useToastStore } from "@/stores/toast";
import { onMounted } from "vue";

setI18nLanguage(localStorage.getItem("lang") ?? "en");
initTheme();

const toastService = useToast();
const toastStore = useToastStore();

// Initialize toast service reference in the store
onMounted(() => {
  toastStore.setToastService(toastService);
});
</script>

<template>
  <!-- Global Toast component that persists across page changes -->
  <Toast />

  <!-- The router view component renders pages -->
  <RouterView />
</template>
