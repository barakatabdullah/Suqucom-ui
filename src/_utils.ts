import api from "./config/axios"

export async function getUser(){
    const {data} = await api.get('user')
      return data
}

export async function getAllPermissions(){
  const {data} = await api.get('permissions')
    return data
}

export async function getAllRoles(){
   const{data }= await api.get('roles')
    return data
}