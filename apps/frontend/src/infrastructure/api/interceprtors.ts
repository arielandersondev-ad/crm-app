import { toast } from "sonner"
import { api } from "./axios"
import { useAuthStore } from "@/stores/auth.store"

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve()
  })
  failedQueue = []
}

export function setupInterceptors () {
  api.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => Promise.reject(error)
  )
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as any

      if (error.response?.status === 401 && !originalRequest?._retry && !originalRequest?.url?.includes('/auth/refresh')) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(() => api(originalRequest))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          await api.post('/auth/refresh')
          processQueue(null)
          return api(originalRequest)
        } catch {
          processQueue(error)
          useAuthStore.getState().logout()
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      }

      if (error.response) {
        const { status, data } = error.response

        if (status === 403) {
          toast.error(data?.message || "Acceso denegado: no tienes permisos para esta acción")
        } else if (status >= 500) {
          toast.error("Error del servidor. Intente nuevamente.")
        } else if (status >= 400) {
          const message = data?.message
          if (typeof message === "string") {
            toast.error(message)
          } else if (Array.isArray(message)) {
            toast.error(message[0])
          }
        }
      }

      return Promise.reject(error)
    }
  )
}