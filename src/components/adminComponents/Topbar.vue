<script lang="ts" setup>
import { toggleColorScheme } from '@/utils/functions'
</script>

<template>
  <div class="border rounded-6 w-full p-9 flex gap-6">
    <LanguageSwitch />
    <Button :label="$t('toggleColorTheme')" @click="toggleColorScheme" />
  </div>
</template>