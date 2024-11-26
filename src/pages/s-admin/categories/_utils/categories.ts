import api from "@/config/axios"


export async function getCategories(){
    const {data} = await api.get('/categories')
      return data
}

export async function getCategoryById(id: number){
    const {data} = await api.get(`/categories/${id}`)
      return data
}

export async function deleteCategory(id: number){
    const {data} = await api.delete(`/categories/${id}`)
      return data
}

