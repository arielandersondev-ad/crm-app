import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { consultationService } from "../services/consultation.service";
import type { CreateConsultationDto, UpdateConsultationDto, UpsertRefractionDto } from "../types/consultation";

export function useConsultation(id: string | undefined) {
  return useQuery({
    queryKey: ["consultation", id],
    queryFn: () => consultationService.findById(id!),
    enabled: !!id,
  });
}

export function usePatientConsultations(clientId: string | undefined) {
  return useQuery({
    queryKey: ["patient-consultations", clientId],
    queryFn: () => consultationService.findByClientId(clientId!),
    enabled: !!clientId,
  });
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateConsultationDto) => consultationService.create(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["patient-consultations", data.clientId] });
    },
  });
}

export function useUpdateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateConsultationDto }) =>
      consultationService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultation"] });
      queryClient.invalidateQueries({ queryKey: ["patient-consultations"] });
    },
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => consultationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-consultations"] });
    },
  });
}

export function useUpsertRefraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ consultationId, dto }: { consultationId: string; dto: UpsertRefractionDto }) =>
      consultationService.upsertRefraction(consultationId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-consultations"] });
    },
  });
}
