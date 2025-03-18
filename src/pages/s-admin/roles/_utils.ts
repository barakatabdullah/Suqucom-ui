import { adminApi } from "@/config/axios";

export async function getRoleById(id: number) {
  const { data } = await adminApi.get(`roles/${id}`);
  return data;
}

export async function deleteRole(id: number) {
  const { data } = await adminApi.delete(`roles/${id}`);
  return data;
}
