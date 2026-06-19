import { api } from "../api/axios"

export async function getSession() {
  const response = await api.get('/auth/me')
  return response.data
}