import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "../services/service.service";

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices(),
  })
}

export function useCreateService() {
  const queryService = useQueryClient()
  return useMutation({
    mutationFn: serviceService.createService,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['services'],
      });
    },
  })
}

export function useUpdateService() {
  const queryService = useQueryClient()
  return useMutation({
    mutationFn: serviceService.updateService,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['services'],
      });
    },
  })
}

export function useDeleteService() {
  const queryService = useQueryClient()
  return useMutation({
    mutationFn: serviceService.softDeleteService,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['services'],
      });
    },
  })
}