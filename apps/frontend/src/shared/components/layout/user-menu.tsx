"use client";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { useAuthStore } from "@/stores/auth.store";

export function UserMenu() {
  const user = useAuthStore(
    (state) => state.user
  );

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="text-sm font-medium">
          {user?.firstName}
        </p>

        <p className="text-xs text-muted-foreground">
          {user?.email}
        </p>
      </div>

      <LogoutButton />
    </div>
  );
}