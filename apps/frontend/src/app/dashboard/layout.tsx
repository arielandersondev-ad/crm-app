"use client";

import { AppShell } from "@/shared/components/layout/shell";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])
  if (!user) return null
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}