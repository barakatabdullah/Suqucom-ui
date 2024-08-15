<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { getUser } from './_utils';




 const {data}=useQuery({
    queryKey:['user'],
    queryFn: getUser 
 })



</script>

<template>
<RouterView/>
<!-- <div class="card flex flex-col gap-6 items-center justify-center">
        <Toast />
        <FileUpload ref="fileupload" mode="basic" name="demo[]" accept="image/*" :maxFileSize="1000000" customUpload @uploader="customUpload" @upload="onUpload" />
        <Button label="Upload" @click="upload" severity="secondary" />
    </div> -->
</template>

