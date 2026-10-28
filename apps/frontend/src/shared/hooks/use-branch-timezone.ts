import { useQuery } from "@tanstack/react-query";
import { api } from "@/infrastructure/api/axios";
import { useAuthStore } from "@/stores/auth.store";

export function useBranchTimezone(enabled = true) {
  const branchId = useAuthStore((state) => state.branch?.id);
  const query = useQuery({
    queryKey: ["branch-timezone", branchId],
    queryFn: async () => {
      const { data } = await api.get<{ timezone: string }>(`/sucursal/${branchId}`);
      return data.timezone;
    },
    enabled: enabled && !!branchId,
  });
  return { ...query, timezone: query.data ?? "America/La_Paz" };
}
