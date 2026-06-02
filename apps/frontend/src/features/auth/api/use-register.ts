import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

export function useRegister() {
  const setUser = useAuthStore((state) => state.setUser);
  const setTenant = useAuthStore((state) => state.setTenant);
  const setBranch = useAuthStore((state) => state.setBranch);

  return useMutation({
    mutationFn: authService.register,

    onSuccess: (data) => {
      setUser(data.user);
      setTenant(data.tenant);
      setBranch(data.sucursal);
    },
  });
}