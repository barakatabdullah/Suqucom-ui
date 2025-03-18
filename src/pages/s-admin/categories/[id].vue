<script setup lang="ts">
// @ts-nocheck
import { toTypedSchema } from "@vee-validate/zod";
import Toast from "primevue/toast";
import * as zod from "zod";
import { useToast } from "primevue/usetoast";
import { useForm } from "vee-validate";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { getCategories, getCategoryById } from "./_utils/categories";
import { api } from "@/config/axios";
import { router } from "@/router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const route = useRoute();
const categoryId = (route.params as { id: number }).id;

const UserSchema = toTypedSchema(
  zod.object({
    name_en: zod
      .string()
      .min(3)
      .max(255)
      .regex(/^[A-Za-z0-9\s\-\_\.]+$/, t("must_be_english")),
    name_ar: zod
      .string()
      .min(3)
      .max(255)
      .regex(/^[\u0600-\u06FF\s0-9\-\_\.]+$/, t("must_be_arabic")),
    slug: zod.string().min(3).max(255),
    parent_id: zod.number().optional(),
    order: zod.number().optional().nullable(),
    published: zod.boolean().default(true),
    active: zod.boolean().default(true),
  }),
);

const { defineField, handleSubmit, errors, resetForm, setValues } = useForm({
  validationSchema: UserSchema,
});

const [name_en] = defineField("name_en");
const [name_ar] = defineField("name_ar");
const [slug] = defineField("slug");
const [parent_id] = defineField("parent_id");
const [order] = defineField("order");
const [published] = defineField("published");
const [active] = defineField("active");
const fileupload = ref();

const arabicToEnglishMap: { [key: string]: string } = {
  ا: "a",
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "dh",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  و: "w",
  ي: "y",
};

const { data: categories } = useQuery({
  queryKey: ["categories"],
  queryFn: getCategories,
});

const { data: currentCategory } = useQuery({
  queryKey: ["category", categoryId],
  queryFn: () => getCategoryById(categoryId),
  enabled: !!categoryId,
});

watchEffect(() => {
  if (name_en.value) {
    slug.value = name_en.value
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\u0000-\u007F]/g, (char) => arabicToEnglishMap[char] || char);
  }
  if (currentCategory.value) {
    setValues({
      name_en: currentCategory.value.name_en,
      name_ar: currentCategory.value.name_ar,
      slug: currentCategory.value.slug,
      parent_id: currentCategory.value.parent_id ?? undefined,
      order: currentCategory.value.order,
      published: !!currentCategory.value.published,
      active: !!currentCategory.value.active,
    });
  }
});

const toast = useToast();

// Mutation
const { mutateAsync } = useMutation({
  mutationFn: async (data: Category) => {
    console.log(data);
    const res = await api
      .post(
        "categories/" + categoryId,
        {
          name_en: data.name_en,
          name_ar: data.name_ar,
          slug: data.slug,
          parent_id: data.parent_id,
          order: data.order,
          published: data.published ? 1 : 0,
          active: data.active ? 1 : 0,
          image: fileupload.value.files[0],
        },
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        },
      )
      .then((res) => res.data);
    return res;
  },
  onSuccess: (res) => {
    console.log(res);
    fileupload.value.clear();
    appStore.toast.add({
      severity: "info",
      summary: "Success",
      detail: "Category saved successfully",
      life: 3000,
    });
  },
  onError: (error) => {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  },
});

const onSubmit = handleSubmit((values) => {
  const categoryData = {
    ...values,
    id: categoryId,
    name: values.name_en,
  };
  return mutateAsync(categoryData);
});
</script>

<template>
  <div class="border rounded-6 w-full h-full p-9 flex flex-col gap-6">
    <Toast />
    <div class="w-full flex items-center justify-between">
      <div class="flex flex-col gap-2 items-start">
        <h2 class="font-600 text-6 text-color">{{ $t("category.manage") }}</h2>
        <p class="text-gray-600">{{ $t("category.manage_sub_title") }}</p>
      </div>
    </div>
    <form
      @submit="onSubmit"
      class="w-full h-full flex flex-col gap-6 overflow-hidden"
    >
      <div class="grid grid-cols-2 gap-6">
        <div class="flex flex-col gap-1">
          <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">{{
            $t("name_ar")
          }}</label>
          <InputText
            v-model="name_ar"
            :class="{ 'p-invalid': errors.name_ar }"
          />
          <span v-if="errors.name_ar" class="text-red-500">{{
            errors.name_ar
          }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">{{
            $t("name_en")
          }}</label>
          <InputText
            v-model="name_en"
            :class="{ 'p-invalid': errors.name_en }"
          />
          <span v-if="errors.name_en" class="text-red-500">{{
            errors.name_en
          }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">{{
            $t("slug")
          }}</label>
          <InputText v-model="slug" :class="{ 'p-invalid': errors.slug }" />
          <span v-if="errors.slug" class="text-red-500">{{ errors.slug }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">{{
            $t("category.parent_category")
          }}</label>
          <Select
            v-model="parent_id"
            :options="categories"
            optionLabel="name"
            optionValue="id"
            :class="{ 'p-invalid': errors.parent_id }"
          />
          <span v-if="errors.parent_id" class="text-red-500">{{
            errors.parent_id
          }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">{{
            $t("order")
          }}</label>
          <InputNumber v-model="order" :class="{ 'p-invalid': errors.order }" />
          <span v-if="errors.order" class="text-red-500">{{
            errors.order
          }}</span>
        </div>
        <div class="flex flex-col gap-1 col-span-2">
          <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname">{{
            $t("image")
          }}</label>
          <FileUpload
            ref="fileupload"
            :fileLimit="1"
            name="demo[]"
            accept="image/*"
            :maxFileSize="1000000"
            customUpload
            :class="{ 'p-invalid': errors.parent_id }"
          />
          <span v-if="errors.parent_id" class="text-red-500">{{
            errors.parent_id
          }}</span>
        </div>
        <div class="flex gap-6 items-center">
          <div class="flex flex-col gap-1">
            <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname"
              >Published</label
            >
            <InputSwitch
              v-model="published"
              :class="{ 'p-invalid': errors.published }"
            />
            <span v-if="errors.published" class="text-red-500">{{
              errors.published
            }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-[#4b465c82] text-3.5 font-semibold" for="fname"
              >Active</label
            >
            <InputSwitch
              v-model="active"
              :class="{ 'p-invalid': errors.active }"
            />
            <span v-if="errors.active" class="text-red-500">{{
              errors.active
            }}</span>
          </div>
        </div>
        <div class="w-full flex justify-end col-span-2">
          <Button class="w-fit" :label="$t('save')" type="submit"></Button>
        </div>
      </div>
    </form>
  </div>
</template>

<route lang="yaml">
name: Category-manage
meta:
  layout: admin
  requiresAuth: true
</route>
