import api from "./config/axios"

export async function getUser(){
    const {data} = await api.get('user')
      return data
}