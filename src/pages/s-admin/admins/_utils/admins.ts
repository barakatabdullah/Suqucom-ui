import { adminApi } from "@/config/axios"

export async function getAdmins(params: QueryParams) {
  const { data } = await adminApi.get('admins', {
    params: {
      page: params.page || 1,
      per_page: params.per_page || 10,
      search: params.search,
      sort_by: params.sort_by || 'id',
      sort_direction: params.sort_direction || 'desc',
      role: params.role,
      active: params.active !== null ? params.active : undefined
    }
  })
  return data
}

export async function getAdminbyId(id: number) {
  const { data } = await adminApi.get(`admins/${id}`)
  return data
}

export async function deleteAdmin(id: number) {
  const { data } = await adminApi.delete(`admins/${id}`)
  return data
}

export async function updateAdmin(id: number, formData: FormData) {
  const { data } = await adminApi.post(`admins/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}

export async function createAdmin(formData: FormData) {
  const { data } = await adminApi.post('admins', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data
}