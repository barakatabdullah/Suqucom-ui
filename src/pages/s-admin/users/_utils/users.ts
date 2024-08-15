import api from "@/config/axios"


export async function getUsers(){
    const {data} = await api.get('users')
      return data
}

export async function getUser(id: string){
    return await api.get(`users/${id}`)
    
}