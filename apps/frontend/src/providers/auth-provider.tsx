"use client";

import { useEffect } from "react";

import { getSession } from "@/infrastructure/auth";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const setTenant = useAuthStore((s) => s.setTenant);
  const setBranch = useAuthStore((s) => s.setBranch);

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();

        setUser(session.user);
        setTenant(session.tenant);
        setBranch(session.branch);
      } catch {
        // usuario no autenticado
      }
    }

    loadSession();
  }, [setUser, setTenant, setBranch]);

  return children;
}