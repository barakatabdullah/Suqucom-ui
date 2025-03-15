import { defineStore } from "pinia";

export const useSettingsStore = defineStore("Settings", {
  state: () => {
    return {
      settings: {
        theme: localStorage.getItem("theme") ?? "light",
        lang: localStorage.getItem("lang") ?? "en",
        isSidebarCollapsed:
          localStorage.getItem("isSidebarCollapsed") === "true",
      },
    };
  },
  actions: {
    toggleSidebar() {
      this.settings.isSidebarCollapsed = !this.settings.isSidebarCollapsed;
      localStorage.setItem(
        "isSidebarCollapsed",
        this.settings.isSidebarCollapsed.toString(),
      );
    },
    closeSidebar() {
      this.settings.isSidebarCollapsed = false;
    },
    openSidebar() {
      this.settings.isSidebarCollapsed = true;
    },
  },
});
