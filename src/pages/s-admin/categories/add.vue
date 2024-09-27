<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import Toast from 'primevue/toast';
import * as zod from 'zod'
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';


const UserSchema = toTypedSchema(
    zod.object({
        name: zod.string().min(3).max(255),
        slug: zod.string().min(3).max(255),
        parent_id: zod.number().optional(),
        order: zod.number().optional().nullable(),
        published: zod.boolean().default(true),
        active: zod.boolean().default(true),
        icon: zod.string().optional(),

    })
)

const { defineField, handleSubmit, errors, resetForm } = useForm({
    validationSchema: UserSchema
})

const [name] = defineField('name');
const [slug] = defineField('slug');
const [parent_id] = defineField('parent_id');
const [order] = defineField('order');
const [published] = defineField('published');
const [active] = defineField('active');
const fileupload = ref();



watchEffect(() => {
    if (name.value) {
        slug.value = name.value.toLowerCase().replace(/ /g, '-');
    }
})


const toast = useToast();

</script>


<template>
    <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6">
        <Toast />
        <div class="w-full flex items-center justify-between">
            <div class="flex flex-col gap-2 items-start">
                <h2 class="font-600 text-6 text-color">Add Category</h2>
                <p class="text-gray-600">You can Add a new Category</p>
            </div>
        </div>
        <form class="w-full h-full flex flex-col gap-6 overflow-hidden">

            <div class="grid grid-cols-2 gap-6">
                <div class="flex flex-col gap-1">
                    <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">Category Name</label>
                    <InputText v-model="name" :class="{ 'p-invalid': errors.name }" />
                    <span v-if="errors.name" class="text-red-500">{{ errors.name }}</span>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">Category Slug</label>
                    <InputText v-model="slug" :class="{ 'p-invalid': errors.slug }" />
                    <span v-if="errors.slug" class="text-red-500">{{ errors.slug }}</span>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">Parent Category</label>
                    <Select v-model="parent_id" :class="{ 'p-invalid': errors.parent_id }" />
                    <span v-if="errors.parent_id" class="text-red-500">{{ errors.parent_id }}</span>
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">Order</label>
                    <InputNumber v-model="order" :class="{ 'p-invalid': errors.order }" />
                    <span v-if="errors.order" class="text-red-500">{{ errors.order }}</span>
                </div>
                <div class="flex flex-col gap-1 col-span-2">
                    <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">Category Image</label>
                    <FileUpload ref="fileupload" name="demo[]" accept="image/*" :maxFileSize="1000000" customUpload :class="{ 'p-invalid': errors.parent_id }" />
                    <span v-if="errors.parent_id" class="text-red-500">{{ errors.parent_id }}</span>
                </div>
                <div class="flex gap-6 items-center">
                    <div class="flex flex-col gap-1">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">Published</label>
                        <InputSwitch v-model="published" :class="{ 'p-invalid': errors.published }" />
                        <span v-if="errors.published" class="text-red-500">{{ errors.published }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">Active</label>
                        <InputSwitch v-model="active" :class="{ 'p-invalid': errors.active }" />
                        <span v-if="errors.active" class="text-red-500">{{ errors.active }}</span>
                    </div>
                </div>
            </div>
        </form>

    </div>
</template>

<route lang="yaml">
    name: Categories-add
    meta:
        layout: admin
        requiresAuth: true
</route>