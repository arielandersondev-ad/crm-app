'use client'
import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser);
  const setTenant = useAuthStore((state) => state.setTenant);
  const setBranch = useAuthStore((state) => state.setBranch);

  const router = useRouter()
  return useMutation({
    mutationFn: authService.login,

    onSuccess: (data) => {
      console.log("[DEV] LOGIN SUCCESS", data);
      setUser(data.user);
      setTenant(data.tenant);
      setBranch(data.sucursal);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("[DEV] LOGIN ERROR", error);
    },
  });
}