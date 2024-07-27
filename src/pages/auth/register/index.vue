<script setup lang="ts">
import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import { useForm } from "vee-validate";
import * as zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useMutation } from "@tanstack/vue-query";
import api from "@/config/axios";

const RegisterSchema = toTypedSchema(
  zod.object({
    // username: zod.string().min(3, { message: "Username must be at least 3 characters" }),
    email: zod.string().email({ message: "Invalid Email" }),
    password: zod.string().min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirmation: zod
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    fname: zod.string().min(3, { message: "First name must be at least 3 characters" }),
    lname: zod.string().min(3, { message: "Last name must be at least 3 characters" }),
    phone: zod.number().min(9, { message: "Phone must be at least 10 characters" }),
    // address: zod.string().min(3, { message: "Address must be at least 3 characters" }),
    city: zod.string().min(3, { message: "City must be at least 3 characters" }),
    // state: zod.string().min(3, { message: "State must be at least 3 characters" }),
    // zip: zod.string().min(5, { message: "Zip must be at least 5 characters" }),
  })
);

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: RegisterSchema,
});

// const [userName] = defineField("username");
const [email] = defineField("email");
const [password] = defineField("password");
const [passwordConfirmation] = defineField("passwordConfirmation");

const [fname] = defineField("fname");
const [lname] = defineField("lname");
const [phone] = defineField("phone");
// const [address] = defineField("address");
const [city] = defineField("city");
// const [state] = defineField("state");
// const [zip] = defineField("zip");



// Mutation
const { mutateAsync } = useMutation({
  mutationFn: async (data:any) => {
    const res = await api
      .post('register', {
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
        fname: data.fname,
        lname: data.lname,
        phone: data.phone,
        city: data.city,
      })
      .then((res) => res.data)
    return res
  },
  onSuccess: (data) => {

    console.log('data',data)
  }
})


const onSubmit = handleSubmit((values) => {
  mutateAsync(values)
});

const check = () => {
  console.log(errors.value);
};

const activeStep = ref(1);
</script>

<template>
  <div class="flex items-center justify-center col-span-5 h-full">
    <form @submit="onSubmit" class="w-full px-28">
      <Stepper v-model:value="activeStep">
        <StepList>
          <div class="flex items-center gap-4 mx-auto mb-10">
            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="1">
              <div
                class="flex flex-row flex-auto items-center gap-2"
                v-bind="a11yAttrs.root"
              >
                <Button
                  :outlined="value !== activeStep"
                  icon="i-tabler-home"
                  @click="activateCallback"
                  v-bind="a11yAttrs.header"
                />
                <div class="flex flex-col">
                  <span class="font-semibold text-[#4b465cd9]">Account</span>
                  <span class="font-semibold text-sm text-[#4b465c82]"
                    >Account Details</span
                  >
                </div>
                <i class="i-tabler-chevron-right text-[#4b465c82] mx-8"></i>
              </div>
            </Step>
            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="2">
              <div
                class="flex flex-row flex-auto items-center gap-2"
                v-bind="a11yAttrs.root"
              >
                <Button
                  :outlined="value !== activeStep"
                  icon="i-tabler-user"
                  @click="activateCallback"
                  v-bind="a11yAttrs.header"
                />
                <div class="flex flex-col">
                  <span class="font-semibold text-[#4b465cd9]">Personal</span>
                  <span class="font-semibold text-sm text-[#4b465c82]"
                    >Personal Details</span
                  >
                </div>
              </div>
            </Step>
          </div>
        </StepList>
        <StepPanels>
          <StepPanel v-slot="{ activateCallback }" :value="1">
            <div class="flex flex-col gap-8">
              <div class="flex flex-col">
                <span class="font-semibold text-[#4b465cd9] text-7.5"
                  >Account Information</span
                >
                <span class="font-semibold text-[#4b465c82]"
                  >Enter Your Account Details</span
                >
              </div>
              <div class="grid grid-cols-1 gap-4">
                <!-- <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="username"
                    >User Name</label
                  >
                  <InputText
                    id="username"
                    v-model="userName"
                    :class="{ 'p-invalid': errors.username }"
                  />
                </div> -->

                <div class=" flex flex-col gap-1">
                  <label class="text-[#4b465c82] text-3.5 font-semibold" for="email"
                    >Email</label
                  >
                <InputText id="email" v-model="email" :class="{ 'p-invalid': errors.email }" />
                </div>

                <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="password"
                    >Password</label
                  >
                <Password
                  id="password"
                  v-model="password"
                  :pt="{
                    pcinput: {
                      root: {
                        class: 'w-full',
                      },
                    },
                  }"
                  :invalid="errors.password"
                />
                </div>


                <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="passwordConfirmation"
                    >Password Confirmation</label
                  >
                <Password
                id="passwordConfirmation"
                  v-model="passwordConfirmation"
                  :invalid="errors.passwordConfirmation"
                  :pt="{
                    pcinput: {
                      root: {
                        class: 'w-full',
                      },
                    },
                  }"
                  :feedback="false"
                />
                </div>
              </div>
              <div class="flex pt-6 justify-end">
                <Button
                  label="Next"
                  icon="i-tabler-arrow-right"
                  iconPos="right"
                  @click="activateCallback(2)"
                />
              </div>
            </div>
          </StepPanel>
          <StepPanel v-slot="{ activateCallback }" :value="2">
            <div class="flex flex-col gap-8">
              <div class="flex flex-col">
                <span class="font-semibold text-[#4b465cd9] text-7.5"
                  >Personal Information</span
                >
                <span class="font-semibold text-[#4b465c82]"
                  >Enter Your Personal Details</span
                >
              </div>
              <div class="grid grid-cols-2 gap-4">

              
                <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="fname">First Name</label>
                  <InputText id="fname" v-model="fname" :class="{ 'p-invalid': errors.fname }" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="lname">Last Name</label>
                  <InputText id="lname" v-model="lname" :class="{ 'p-invalid': errors.lname }" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="phone">Phone</label>
                  <InputNumber id="phone" v-model="phone" :class="{ 'p-invalid': errors.phone }" />
                </div>
                <!-- <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="zip">Zip</label>
                  <InputNumber id="zip" v-model="zip" :class="{ 'p-invalid': errors.zip }" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="address">Address</label>
                  <InputText
                    id="address"
                    v-model="address"
                    :class="['col-span-2', { 'p-invalid': errors.address }]"
                  />
                </div> -->
                <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="city">City</label>
                  <InputText id="city" v-model="city" :class="{ 'p-invalid': errors.city }" />
                </div>
                <!-- <div class="flex flex-col gap-1">
                  <label class="font-semibold text-[#4b465c82] text-3.5" for="state">State</label>
                  <InputText id="state" v-model="state" :class="{ 'p-invalid': errors.state }" />
                </div> -->
              </div>
              <div class="flex pt-6 justify-between">
                <Button
                  outlined
                  label="Previous"
                  icon="i-tabler-arrow-left"
                  iconPos="left"
                  @click="activateCallback(1)"
                />
                <Button type="submit" label="Submit" />
              </div>
            </div>
          </StepPanel>
        </StepPanels>
      </Stepper>
    </form>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
  left: "Welcome"
  span: 3
</route>
