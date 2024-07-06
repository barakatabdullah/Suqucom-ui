<script setup lang="ts">

const toggleColorScheme=()=> {
    const element = document.querySelector('html');
    element.classList.toggle('my-app-dark');
}


</script>
<template>
    <Button label="Toggle Color Scheme" @click="toggleColorScheme" />

</template>