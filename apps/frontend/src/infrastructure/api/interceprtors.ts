import { api } from "./axios"

export function setupInterceptors () {
  api.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => Promise.reject(error)
  )
  api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  )
}