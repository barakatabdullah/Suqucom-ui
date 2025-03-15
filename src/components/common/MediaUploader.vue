<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Upload Media",
  },
  description: {
    type: String,
    default: "Drag and drop files to upload",
  },
  accept: {
    type: String,
    default: "image/*",
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  maxFileSize: {
    type: Number,
    default: 5000000, // 5MB
  },
  initialFiles: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String,
    default: "edit", // 'edit' or 'view'
  },
});

const emit = defineEmits(["update:files", "file-uploaded", "file-removed"]);

const files = ref([...props.initialFiles]);
const uploadedFiles = ref([]);

function onUpload(event) {
  for (let file of event.files) {
    uploadedFiles.value.push(file);
  }
  emit("file-uploaded", uploadedFiles.value);
  emit("update:files", uploadedFiles.value);
}

function removeUploadedFile(index) {
  uploadedFiles.value.splice(index, 1);
  emit("file-removed", index);
  emit("update:files", uploadedFiles.value);
}

function removeFile(file, removeCallback, index) {
  removeCallback(index);
}

function formatSize(bytes) {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
</script>

<template>
  <FileUpload
    v-model:files="files"
    :multiple="multiple"
    :accept="accept"
    :maxFileSize="maxFileSize"
    @upload="onUpload"
    :auto="true"
    :disabled="mode === 'view'"
    class="w-full h-full"
  >
    <template #header="{ chooseCallback, clearCallback, files }">
      <div class="flex flex-col h-28 gap-2">
        <h5>{{ title }}</h5>
        <p class="text-sm text-gray-500">{{ description }}</p>
        <div class="flex gap-2" v-if="mode === 'edit'">
          <Button
            @click="chooseCallback"
            icon="i-hugeicons-upload-03"
            rounded
            outlined
            severity="primary"
          />
          <Button
            @click="clearCallback()"
            icon="i-hugeicons-cancel-01"
            rounded
            outlined
            severity="danger"
            :disabled="!files || files.length === 0"
          />
        </div>
      </div>
    </template>

    <template
      #content="{
        files,
        uploadedFiles,
        removeUploadedFileCallback,
        removeFileCallback,
      }"
    >
      <div class="flex flex-col gap-8 pt-4">
        <div v-if="files.length > 0">
          <h5>Pending</h5>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="(file, index) of files"
              :key="file.name + file.type + file.size"
              class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
            >
              <div>
                <img
                  v-if="file.type.startsWith('image')"
                  role="presentation"
                  :alt="file.name"
                  :src="file.objectURL"
                  width="100"
                  height="50"
                />
                <i v-else class="i-hugeicons-file text-4xl"></i>
              </div>
              <span
                class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
              >
                {{ file.name }}
              </span>
              <div>{{ formatSize(file.size) }}</div>
              <Badge value="Pending" severity="warn" />
              <Button
                v-if="mode === 'edit'"
                icon="i-hugeicons-trash"
                @click="removeFile(file, removeFileCallback, index)"
                outlined
                rounded
                severity="danger"
              />
            </div>
          </div>
        </div>

        <div v-if="uploadedFiles.length > 0">
          <h5>Completed</h5>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="(file, index) of uploadedFiles"
              :key="file.name + file.type + file.size"
              class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
            >
              <div>
                <img
                  v-if="file.type.startsWith('image')"
                  role="presentation"
                  :alt="file.name"
                  :src="file.objectURL"
                  width="100"
                  height="50"
                />
                <i v-else class="i-hugeicons-file text-4xl"></i>
              </div>
              <span
                class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden"
              >
                {{ file.name }}
              </span>
              <Badge value="Completed" class="mt-4" severity="success" />
              <Button
                v-if="mode === 'edit'"
                icon="i-hugeicons-trash"
                @click="removeUploadedFile(index)"
                outlined
                rounded
                severity="danger"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #empty>
      <div class="flex h-full items-center justify-center flex-col">
        <div
          class="flex items-center justify-center aspect-square border-2 rounded-full p-8"
        >
          <i class="i-hugeicons-image-upload text-4xl text-muted-color" />
        </div>
        <p class="mt-6 mb-0">Drag and drop files to here to upload.</p>
      </div>
    </template>
  </FileUpload>
</template>
