"use client";

import { AppShell } from "@/shared/components/layout/shell";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { authService } from "@/features/auth/services/auth.service";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const setTenant = useAuthStore((state) => state.setTenant)
  const setBranch = useAuthStore((state) => state.setBranch)
  const logout = useAuthStore((state) => state.logout)
  const validated = useRef(false)

  useEffect(() => {
    if (!user) {
      router.replace("/login")
      return
    }

    if (validated.current) return
    validated.current = true

    authService.me()
      .then((data) => {
        setUser(data.user)
        setTenant(data.tenant)
        setBranch(data.sucursal)
      })
      .catch(() => {
        logout()
        router.replace("/login")
      })
  }, [user, router, setUser, setTenant, setBranch, logout])

  if (!user) return null
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}