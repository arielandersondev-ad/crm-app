import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faqService } from "../services/faq.service";

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () => faqService.list(),
  });
}

export function useCreateFaq() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: faqService.create,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useUpdateFaq() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      faqService.update(id, data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useDeleteFaq() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: faqService.delete,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
}

export function useBotConfig() {
  return useQuery({
    queryKey: ["bot-config"],
    queryFn: () => faqService.getConfig(),
  });
}

export function useUpdateBotConfig() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: faqService.updateConfig,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["bot-config"] });
    },
  });
}
