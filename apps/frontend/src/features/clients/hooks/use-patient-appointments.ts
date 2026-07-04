import { useQuery } from "@tanstack/react-query";
import { api } from "@/infrastructure/api/axios";

export function usePatientAppointments(clientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-appointments", clientId],
    queryFn: async () => {
      const response = await api.get(`/cita/client/${clientId}`);
      return response.data;
    },
    enabled: !!clientId,
  });
}
