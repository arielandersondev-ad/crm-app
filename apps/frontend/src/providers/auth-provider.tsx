"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { getSession } from "@/infrastructure/auth";
import { useAuthStore } from "@/stores/auth.store";
import { api } from "@/infrastructure/api/axios";

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
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/login";

  useEffect(() => {
    if (isPublicPage) {
      setIsLoading(false);
      return;
    }

    async function loadSession() {
      try {
        const session = await getSession();

        setUser(session.user);
        setTenant(session.tenant);
        setBranch(session.sucursal ?? session.branch);
      } catch {
        try {
          await api.post("/auth/refresh");
          const session = await getSession();
          setUser(session.user);
          setTenant(session.tenant);
          setBranch(session.sucursal ?? session.branch);
        } catch {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, [setUser, setTenant, setBranch, logout, isPublicPage]);

  if (isLoading) {
    return null;
  }
  return children;
}