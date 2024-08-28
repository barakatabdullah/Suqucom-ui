import api from "@/config/axios"


export async function getUsers(){
    const {data} = await api.get('users')
      return data
}

export async function getUserbyId(id: number){
    const {data}= await api.get(`users/${id}`)
    return data
    
}



export async function deleteUser(id: number){
    const {data} = await api.delete(`users/${id}`)
    return data
}