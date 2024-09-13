import { defineStore } from 'pinia'



export const useLayoutStore = defineStore('LayoutStore', {
  state: () => {
    return {
      layout: {
        isSidebarCollapsed: false,
      }
    }
  },
  actions: {
    toggleSidebar() {
      this.layout.isSidebarCollapsed = !this.layout.isSidebarCollapsed;
    },
    closeSidebar() {
      this.layout.isSidebarCollapsed = false;
    },
    openSidebar() {
      this.layout.isSidebarCollapsed = true;
    },
  }
})

