<script setup lang="ts">
const toggleColorScheme = () => {
  const element = document.querySelector("html");
  element?.classList.toggle("s-dark-mode");
};
</script>

<template>
  <Button label="Toggle Color Scheme" @click="toggleColorScheme" />
</template>

<route lang="yaml">
  name: Home
  meta:
  requiresAuth: true
  </route>