import { api } from "@/infrastructure/api/axios";
import { useQuery } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async() => {
      const response = await api.get("/auth/profile")
      return response.data
    }
  })
}