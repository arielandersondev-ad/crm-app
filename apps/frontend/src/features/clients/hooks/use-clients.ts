import { useQuery } from "@tanstack/react-query";

import { clientService } from "../services/client.service";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],

    queryFn: () =>
      clientService.getClients(),
  });
}