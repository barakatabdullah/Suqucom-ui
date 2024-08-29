import api from "@/config/axios"

export async function getRoleById(id: number){
    const {data}= await api.get(`roles/${id}`)
    return data
    
}