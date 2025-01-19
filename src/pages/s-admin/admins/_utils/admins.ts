import { adminApi } from "@/config/axios"


export async function getAdmins(){
    const {data} = await adminApi.get('admins')
      return data
}

export async function getAdminbyId(id: number){
    const {data}= await adminApi.get(`admins/${id}`)
    return data
    
}



export async function deleteAdmin(id: number){
    const {data} = await adminApi.delete(`admins/${id}`)
    return data
}