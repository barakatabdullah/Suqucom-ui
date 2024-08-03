import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import api from '@/config/axios'

const router = useRouter()

export const useUserStore = defineStore('User', {
  state: () => {
    return {
      user: {
        name: localStorage.getItem('user'),
        role: localStorage.getItem('role'),
        token: localStorage.getItem('token')
      }
    }
  },
  actions: {
    // logout() {
    //   api
    //     .get(`/user/logout`, {
    //       headers: {
    //         Authorization: `Bearer ${this.user.token}`,
    //         'Content-Type': 'application/json'
    //       }
    //     })
    //     .then((res) => {
    //       // eslint-disable-next-line eqeqeq
    //       if (res.status == 200) {
    //         localStorage.removeItem('token')
    //         this.user.token = localStorage.getItem('token')
    //         // router.push({ name: 'auth' })
    //       }
    //     })
    //     .catch(() => {
    //       localStorage.removeItem('token')
    //       this.user.token = localStorage.getItem('token')
    //     })
    // },

  }
})