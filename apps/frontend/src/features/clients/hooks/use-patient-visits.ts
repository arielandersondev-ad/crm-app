import { useQuery } from "@tanstack/react-query";
import { api } from "@/infrastructure/api/axios";

export function usePatientVisits(clientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-visits", clientId],
    queryFn: async () => {
      const response = await api.get(`/visitas/client/${clientId}`);
      return response.data;
    },
    enabled: !!clientId,
  });
}
