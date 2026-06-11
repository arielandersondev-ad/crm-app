import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { visitService } from "../services/visit.service";
import { visitDetailService } from "../services/visit-detail.service";
import { useAuthStore } from "@/stores/auth.store";

export function useVisits() {
  return useQuery({
    queryKey: ["visits"], 
    queryFn: () => visitService.getVisits()
  });
}

export function useVisitForm() {
  return useQuery({
    queryKey: ["visit"],
    queryFn: () => visitService.getVisitForm()
  });
}

export function useCreateVisit() {
  const queryService = useQueryClient();
  return useMutation({
    mutationFn: visitService.createVisit,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visits'],
      });
    },
  });
}

export function useUpdateVisit() {
  const queryService = useQueryClient();
  return useMutation({
    mutationFn: visitService.updateVisit,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visits'],
      });
    },
  });
}
// Detail Visit
export function useDetailsVisit(visitId: string) {
  return useQuery({
    queryKey: ["visitdetail", visitId],
    queryFn: () => visitDetailService.getDetailsVisit(visitId)
  });
}

export function useUpdateVisitDetail(visitId: string) {
  const queryService = useQueryClient();
  return useMutation({
    mutationFn: visitDetailService.updateVisitDetail,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visitdetail', visitId],
      });
    },
  });
}

export function useCreateVisitDetail(visitId: string) {
  const queryService = useQueryClient();
  return useMutation({
    mutationFn: visitDetailService.createVisitDetail,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visitdetail', visitId],
      });
    },
  });
}

export function useCreateManyVisitDetails(visitId: string) {
  const queryService = useQueryClient();
  return useMutation({
    mutationFn: visitDetailService.createManyVisitDetails,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visitdetail', visitId],
      });
    },
  });
}

export function useDeleteVisitDetail(visitId: string) {
  const queryService = useQueryClient();
  return useMutation({
    mutationFn: visitDetailService.deleteVisitDetail,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visitdetail', visitId],
      });
    },
  });
}
