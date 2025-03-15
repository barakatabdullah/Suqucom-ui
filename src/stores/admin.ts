import { adminApi } from "@/config/axios";
import { router } from "@/router";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useAdminStore = defineStore("Admin", {
  state: () => {
    return {
      admin: {
        name: localStorage.getItem("adminName"),
        avatar: localStorage.getItem("adminAvatar"),
        role: localStorage.getItem("role"),
        token: localStorage.getItem("adminToken"),
      },
    };
  },
  actions: {
    getAdminToken() {
      return this.admin.token;
    },

    async logout() {
      await adminApi.post("logout");

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");
      localStorage.removeItem("adminAvatar");
      localStorage.removeItem("role");

      this.admin.token = null;

      router.push({ name: "AdminLogin" });
    },
  },
});
