import { api } from "@/config/axios";

export async function getRoleById(id: number) {
  const { data } = await api.get(`roles/${id}`);
  return data;
}

export async function deleteRole(id: number) {
  const { data } = await api.delete(`roles/${id}`);
  return data;
}
