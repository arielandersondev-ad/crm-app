"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useLogout } from "../api/use-logout";

export function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <Button
      variant="outline"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
    >
      <LogOut className="mr-2 h-4 w-4" />

      {logoutMutation.isPending
        ? "Cerrando sesión..."
        : "Cerrar sesión"}
    </Button>
  );
}