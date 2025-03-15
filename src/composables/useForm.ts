import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";

export function useForm(options) {
  const {
    submitFn,
    initialValues = {},
    validationSchema = null,
    redirectTo = null,
    successMessage = "Form submitted successfully",
    errorMessage = "An error occurred",
  } = options;

  const toast = useToast();
  const router = useRouter();
  const form = reactive({ ...initialValues });
  const errors = ref({});
  const isSubmitting = ref(false);

  // Validation function
  const validate = () => {
    if (!validationSchema) return true;

    try {
      validationSchema.validateSync(form, { abortEarly: false });
      errors.value = {};
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      errors.value = newErrors;
      return false;
    }
  };

  // Submit handler
  const mutation = useMutation({
    mutationFn: () => submitFn(form),
    onSuccess: () => {
      toast.add({
        severity: "success",
        summary: "Success",
        detail: successMessage,
        life: 3000,
      });
      if (redirectTo) {
        router.push(redirectTo);
      }
    },
    onError: (error) => {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error?.message || errorMessage,
        life: 3000,
      });

      // Handle API validation errors if they exist
      if (error?.response?.data?.errors) {
        const apiErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          apiErrors[key] = Array.isArray(value) ? value[0] : value;
        });
        errors.value = apiErrors;
      }
    },
  });

  const submit = async () => {
    if (validate()) {
      mutation.mutate();
    }
  };

  const reset = () => {
    Object.assign(form, initialValues);
    errors.value = {};
  };

  return {
    form,
    errors,
    submit,
    reset,
    isSubmitting: computed(() => mutation.isPending.value),
  };
}
