<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as zod from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useMutation } from '@tanstack/vue-query'
import api from '@/config/axios'
const RegisterSchema = toTypedSchema(
  zod.object({
    email: zod.string().email({ message: 'Invalid Email' }),
    password: zod.string().min(8, { message: 'Password must be at least 8 characters' })
  })
)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: RegisterSchema
})

const [email] = defineField('email')
const [password] = defineField('password')

// Mutation
const { mutateAsync } = useMutation({
  mutationFn: async (data: any) => {
    const res = await api
      .post('login', {
        email: data.email,
        password: data.password
      })
      .then((res) => res.data)
    return res
  },
  onSuccess: (data) => {
    console.log('data', data)
  }
})

const onSubmit = handleSubmit((values) => {
  mutateAsync(values)
})

const check = () => {
  console.log(errors.value)
}
</script>

<template>
  <div class="flex items-center justify-center col-span-4 h-full">
    <form @submit="onSubmit" class="w-full px-28">
      <div class="flex flex-col gap-8">
        <div class="grid grid-cols-1 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-[#4b465c82] text-3.5 font-semibold" for="email">Email</label>
            <InputText id="email" v-model="email" :class="{ 'p-invalid': errors.email }" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-semibold text-[#4b465c82] text-3.5" for="password">Password</label>
            <Password
              id="password"
              v-model="password"
              :feedback="false"
              :pt="{
                pcinput: {
                  root: {
                    class: 'w-full'
                  }
                }
              }"
              :invalid="errors.password"
            />
          </div>

          <Button
          type="submit"
          label="Login"
          
          />
        </div>
      </div>
    </form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
  left: 'Welcome'
  span: 4
</route>
