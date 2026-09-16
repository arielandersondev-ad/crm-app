"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useLogout } from "../api/use-logout";

export function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <Button
      variant="outline"
      aria-label={logoutMutation.isPending ? "Cerrando sesión" : "Cerrar sesión"}
      className="shrink-0 px-2 sm:px-3"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      <LogOut className="size-4 sm:mr-2" />

      <span className="sr-only sm:not-sr-only">
        {logoutMutation.isPending
          ? "Cerrando sesión..."
          : "Cerrar sesión"}
      </span>
    </Button>
  );
}
