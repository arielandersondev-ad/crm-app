import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { visitService } from "../services/visit.service";

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