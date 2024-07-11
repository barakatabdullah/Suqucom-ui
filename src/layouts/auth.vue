<script setup lang="ts">
import { useRouter } from "vue-router";
</script>

<template>
  <div class="w-full h-screen overflow-hidden">
    <div class="grid grid-cols-8 w-full h-full">
      <div :class="`h-full col-span-${useRouter().currentRoute.value.meta.span} flex items-center justify-center m-4 p-12 rounded-2 bg-[#F8F7FA]`">
        {{ useRouter().currentRoute.value.meta.left }}
      </div>
        <RouterView />
    </div>
  </div>
</template>
