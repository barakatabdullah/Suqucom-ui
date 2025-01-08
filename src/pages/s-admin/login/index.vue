<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as zod from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import { adminApi } from '@/config/axios'
import { router } from '@/router'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { toggleColorScheme } from '@/utils/functions'

const adminStore = useAdminStore()
const toast = useToast()

const settingsStore = useSettingsStore()

const LoginSchema = toTypedSchema(
  zod.object({
    email: zod.string().email({ message: 'Invalid Email' }),
    password: zod.string().min(8, { message: 'Password must be at least 8 characters' })
  })
)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: LoginSchema
})

const [email] = defineField('email')
const [password] = defineField('password')

// Mutation
const { mutateAsync } = useMutation({
  mutationFn: async (data: {email:Admin['email'], password:string}) => {
    const res = await adminApi
      .post('admin/login', {
        email: data.email,
        password: data.password
      })
      .then((res) => res.data)
    return res
  },
  onSuccess: (data:{ admin:Admin, token:string }) => {
    adminStore.admin.name = data.admin.name
    adminStore.admin.token = data.token

    localStorage.setItem('adminName', data.admin.name)
    localStorage.setItem('adminToken', data.token)

    router.push({ name: 'AdminDashboard' })
    console.log(data)
  },
  onError: (error: { response?: { data?: string } }) => {
    toast.add({ severity: 'error', summary: 'Error', detail: error.response?.data, life: 3000 })
  }
})

const onSubmit = handleSubmit((values) => {
  mutateAsync(values)
})

</script>

<template>
  <Toast />
  <div class="flex items-center justify-center col-span-4 w-full h-full bg-primary-100 dark:bg-primary-950 text-primary-900 dark:text-primary-100 relative">
    <div class="absolute top-6 start-6 flex items-center gap-4">
      <LanguageSwitch />
      <Button
        :icon="settingsStore.settings.theme === 'light' ? 'i-hugeicons-moon-02' : 'i-hugeicons-sun-01'"
        @click="toggleColorScheme" />

    </div>
    <div class="max-w-30rem rounded-5 w-full bg-white border dark:border-neutral-800 dark:bg-primary-900 py-12 px-6 ">
      <form @submit="onSubmit" class="w-full px-4">
        <div class="flex flex-col gap-6">

              <h1 class="text-3xl text-center font-bold text-primary-700 dark:text-primary-300">{{$t('login')}}</h1>

            <div class="flex flex-col gap-2">
              <label class="text-primary-500 text-3.5 font-semibold" for="email">{{$t('email')}}</label>
              <InputText id="email" v-model="email" :class="{ 'p-invalid': errors.email }" />
            </div>

            <div class="flex flex-col gap-2">
              <label class="font-semibold text-primary-500 text-3.5" for="password">{{$t('password')}}</label>
              <Password id="password" v-model="password" :feedback="false" :pt="{
              pcinputtext: {
                root: {
                  class: 'w-full'
                }
              }
            }" :invalid="!!errors.password" />
            </div>

            <Button type="submit" :label="$t('login')" />

        </div>
      </form>
    </div>
  </div>
</template>

<route lang="yaml">
name: AdminLogin
meta:
layout: default
</route>
