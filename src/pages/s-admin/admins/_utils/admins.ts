import { adminApi } from "@/config/axios"


export async function getAdmins({page = 1}){
    const {data} = await adminApi.get('admins',{
        params: {
            page
        }
    })
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