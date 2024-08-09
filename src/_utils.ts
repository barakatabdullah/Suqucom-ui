import api from "./config/axios"

export async function getUser(){
    const userStore = useUserStore()
    const {data} = await api.get('user', {
        headers: { Authorization: `Bearer ${userStore.user.token}` }
      })
      return data
}