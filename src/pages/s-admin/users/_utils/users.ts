import { adminApi } from "@/config/axios"

export async function getUsers(params: QueryParams) {
  const { data } = await adminApi.get('users', {
    params: {
      page: params.page || 1,
      per_page: params.per_page || 10,
      search: params.search,
      sort_by: params.sort_by || 'id',
      sort_direction: params.sort_direction || 'desc',
    //   active: params.active !== null ? params.active : undefined
    }
  })
  return data
}

export async function getUserbyId(id: number) {
  const { data } = await adminApi.get(`users/${id}`)
  return data
}

export async function deleteUser(id: number) {
  const { data } = await adminApi.delete(`users/${id}`)
  return data
}

export async function updateUser(id: number, formData: FormData) {
  const { data } = await adminApi.post(`users/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export async function createUser(formData: FormData) {
  const { data } = await adminApi.post('users', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}