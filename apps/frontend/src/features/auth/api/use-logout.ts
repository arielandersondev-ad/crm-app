import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { authService } from "../services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.logout,

    onSuccess: async () => {
      logout();
      await queryClient.clear();
    },
  });
}