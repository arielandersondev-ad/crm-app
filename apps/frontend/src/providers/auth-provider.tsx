"use client";

import { useEffect, useState } from "react";

import { getSession } from "@/infrastructure/auth";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useAuthStore((s) => s.setUser);
  const setTenant = useAuthStore((s) => s.setTenant);
  const setBranch = useAuthStore((s) => s.setBranch);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();

        setUser(session.user);
        setTenant(session.tenant);
        setBranch(session.branch);
      } catch {
        logout()
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, [setUser, setTenant, setBranch, logout]);

  if (isLoading) {
    return null;
  }
  return children;
}