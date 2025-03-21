import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore("toast", () => {
  // Toast service reference will be set when the App component is mounted
  let toastService: any = null;

  // Initialize toast service
  const setToastService = (service: any) => {
    toastService = service;
  };

  // Show success toast
  const success = (summary: string, detail?: string, life = 3000) => {
    if (toastService) {
      toastService.add({
        severity: "success",
        summary,
        detail,
        life,
      });
    }
  };

  // Show error toast
  const error = (summary: string, detail?: string, life = 3000) => {
    if (toastService) {
      toastService.add({
        severity: "error",
        summary,
        detail,
        life,
      });
    }
  };

  // Show info toast
  const info = (summary: string, detail?: string, life = 3000) => {
    if (toastService) {
      toastService.add({
        severity: "info",
        summary,
        detail,
        life,
      });
    }
  };

  // Show warning toast
  const warning = (summary: string, detail?: string, life = 3000) => {
    if (toastService) {
      toastService.add({
        severity: "warn",
        summary,
        detail,
        life,
      });
    }
  };

  return {
    setToastService,
    success,
    error,
    info,
    warning,
  };
});
