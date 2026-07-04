import { useQuery } from "@tanstack/react-query";
import { clientService } from "../services/client.service";

export function useClientById(id: string | undefined) {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => clientService.getClientById(id!),
    enabled: !!id,
  });
}
