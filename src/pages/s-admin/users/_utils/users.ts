import api from "@/config/axios"


export async function getUsers(){
    const {data} = await api.get('users')
      return data
}

export async function getUserbyId(id: number){
    return await api.get(`users/${id}`)
    
}


export async function getAllPermissions(){
    const {data} = await api.get('permissions')
      return data
}

export async function getAllRoles(){
    const {data} = await api.get('roles')
      return data
}