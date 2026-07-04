import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { patientProfileService } from "../services/patient-profile.service";

export function usePatientProfile(clientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-profile", clientId],
    queryFn: () => patientProfileService.findByClientId(clientId!),
    enabled: !!clientId,
  });
}

export function useCreatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patientProfileService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patient-profile", data.clientId] });
    },
  });
}

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, ...dto }: { clientId: string } & import("../types/patient-profile").UpdatePatientProfileDto) =>
      patientProfileService.update(clientId, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patient-profile", data.clientId] });
    },
  });
}
