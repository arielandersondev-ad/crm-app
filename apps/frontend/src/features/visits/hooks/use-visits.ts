import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { visitService } from "../services/visit.service";
import { visitDetailService } from "../services/visit-detail.service";
import { visitPaymentService } from "../services/visit-payment.service";

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

export function usePaymentVisit(visitId: string) {
  return useQuery({
    queryKey: ["visit-payments",visitId],
    queryFn: () => visitPaymentService.getPayments(visitId),
    enabled: !!visitId
  })
}

export function useCreatePayment(visitId: string) {
  const queryService = useQueryClient()
  return useMutation({
    mutationFn: visitPaymentService.createPayment,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visit-payments',visitId]
      })
    }
  })
}

export function useUpdatePayment(visitId: string) {
  const queryService = useQueryClient()
  return useMutation({
    mutationFn: visitPaymentService.updatePayment,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visit-payments',visitId]
      })
    }
  })
}

export function useActivarPayment(visitId: string) {
  const queryService = useQueryClient()
  return useMutation({
    mutationFn: visitPaymentService.activarPayment,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visit-payments',visitId]
      })
    }
  })
}

export function useDesactivarPayment(visitId: string) {
  const queryService = useQueryClient()
  return useMutation({
    mutationFn: visitPaymentService.desactivarPayment,
    onSuccess: () => {
      queryService.invalidateQueries({
        queryKey: ['visit-payments',visitId]
      })
    }
  })
}

export function useSumary(visitId: string){
  return useQuery({
    queryKey: ["visit-payments",visitId],
    queryFn: () => visitPaymentService.sumary(visitId),
    enabled: !!visitId
  })
}