import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { clientService } from "../services/client.service";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],

    queryFn: () =>
      clientService.getClients(),
  });
}
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientService.createClient,
    mutationKey: ["createClient"],

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
  });
}
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientService.updateClient,
    mutationKey: ["updateClient"],

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientService.deleteClient,
    mutationKey: ["deleteClient"],

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clients"],
      });
    },
  });
}