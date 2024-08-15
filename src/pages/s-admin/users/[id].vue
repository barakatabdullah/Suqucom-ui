<script lang="ts" setup>
import { getUser } from '@/_utils';
import { useQuery } from '@tanstack/vue-query';
import moment from 'moment';

const route = useRoute()
const userId = (route.params as { id: number }).id;

const mode = ref<'view' | 'edit'>(route.query.mode as 'view' | 'edit' ?? 'view')

function toggleMode() {
  mode.value = mode.value === 'view' ? 'edit' : 'view'
}

const {data} = useQuery({
    queryKey: ['users', userId],
    queryFn: getUser,
})


const fileupload = ref();

const upload = () => {
fileupload.value.upload();
};

const customUpload = (event) => {
   const file = event.files[0];
   const reader = new FileReader();

   // mutateAsync({ image: file });
   
}






  

</script>


<template>
  <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6">
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-2 items-start">
        <h2 class="font-600 text-6 text-color">{{ mode === 'view'? "View":"Edit" }} User</h2>
        <p class="text-gray-600">You can View, Edit and Remove user</p>
      </div>

      <Button  @click="toggleMode" :label="mode === 'view'?'Edit':'View'" />
    </div>
    <div class="w-full h-full grid grid-cols-8 gap-8 max-lg:grid-cols-1">
        <Card class="aspect-square border !shadow-none col-span-2 max-lg:col-span-1 relative">
            <template #content>

                <FileUpload class="h-full!" ref="fileupload" name="demo[]" accept="image/*" :maxFileSize="1000000" customUpload @uploader="customUpload" @upload="onUpload">
                  <template #header="{ clearCallback, files }">
                <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                    <div class="flex gap-2">
                        <Button @click="clearCallback()" icon="i-heroicons-trash" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
                    </div>
                    <!-- <ProgressBar :value="totalSizePercent" :showValue="false" class="md:w-20rem h-1 w-full md:ml-auto">
                        <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
                    </ProgressBar> -->
                </div>
            </template>

            <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback }">
                <div class="flex flex-col gap-8 pt-4">
                    <div v-if="files.length > 0">
                        <h5>Pending</h5>
                        <div class="flex flex-wrap gap-4">
                            <div v-for="(file, index) of files" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                <div>
                                    <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                                </div>
                                <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                                <!-- <div>{{ formatSize(file.size) }}</div> -->
                                <Badge value="Pending" severity="warn" />
                                <!-- <Button icon="pi pi-times" @click="onRemoveTemplatingFile(file, removeFileCallback, index)" outlined rounded severity="danger" /> -->
                            </div>
                        </div>
                    </div>

                    <div v-if="uploadedFiles.length > 0">
                        <h5>Completed</h5>
                        <div class="flex flex-wrap gap-4">
                            <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size" class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
                                <div>
                                    <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                                </div>
                                <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>

                                <Badge value="Completed" class="mt-4" severity="success" />
                                <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded severity="danger" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template #empty>
                <div class="flex items-center justify-center flex-col">
                    <div class="flex items-center justify-center aspect-square border-2 rounded-full p-8">
                      <i class="i-hugeicons-image-upload text-4xl text-muted-color" />
                    </div>
                    <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
                </div>
            </template>
                </FileUpload>

                <!-- <div v-if="mode==='edit'" class="flex flex-col  w-full gap-2 h-full absolute top-0 left-0 p-4">
            <label class="flex flex-col text-center gap-4 text-#4338ca  cursor-pointer items-center justify-center w-full h-full  border rounded-2" htmlFor="thumbnail">
              <i class="i-tabler-cloud-upload text-10"></i>
              <p class="font-bold text-6">Upload Photo</p>
            </label>
            <input
            class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              type="file"
              id="thumbnail"
              accept="image/png, image/jpeg"
            />
          </div> -->
          <div v-if="mode==='view'&& data" class="flex flex-col  w-full gap-2 h-full absolute top-0 left-0 p-4">
           <Image class="w-full " :src="data.avatar" alt="avatar" />
          </div>

            </template>
        </Card>

        <div class="col-span-6 flex flex-col gap-6 max-lg:col-span-1">
            <Card class="w-full shadow-none border">
                <template #content>
                    hello
                </template>
            </Card>
            </div>

        
    </div>
    


</div>
</template>

<route lang="yaml">
  name: Users-id
  meta:
    layout: admin
    requiresAuth: true
</route>
