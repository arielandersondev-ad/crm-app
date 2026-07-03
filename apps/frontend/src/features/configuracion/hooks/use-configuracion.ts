import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { configuracionService } from "../services/configuracion.service";

export function useTenant() {
  return useQuery({
    queryKey: ["tenant-me"],
    queryFn: () => configuracionService.getTenant(),
  });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      configuracionService.updateTenant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-me"] });
    },
  });
}

export function useGeneralConfiguration() {
  return useQuery({
    queryKey: ["general-configuration"],
    queryFn: () => configuracionService.getConfiguration(),
  });
}

export function useUpdateGeneralConfiguration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) =>
      configuracionService.updateConfiguration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["general-configuration"] });
    },
  });
}

export function useSucursales() {
  return useQuery({
    queryKey: ["sucursales-config"],
    queryFn: () => configuracionService.getSucursales(),
  });
}

export function useSchedules(sucursalId: string | undefined) {
  return useQuery({
    queryKey: ["schedules", sucursalId],
    queryFn: () => configuracionService.getSchedules(sucursalId!),
    enabled: !!sucursalId,
  });
}

export function useUpdateSchedules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sucursalId, schedules }: { sucursalId: string; schedules: any[] }) =>
      configuracionService.updateSchedules(sucursalId, schedules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}
