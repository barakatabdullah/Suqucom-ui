import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()

export const useAdminStore = defineStore('Admin', {
  state: () => {
    return {
      admin: {
        name: localStorage.getItem('adminName'),
        role: localStorage.getItem('role'),
        token: localStorage.getItem('adminToken')
      }
    }
  },
  actions: {
    getAdminToken() {
      return this.admin.token
    }


  }
})




