"use client";

import { LogoutButton } from "@/features/auth/components/logout-button";
import { useAuthStore } from "@/stores/auth.store";

export function UserMenu() {
  const user = useAuthStore(
    (state) => state.user
  );
  const initial = (user?.firstName?.trim() || user?.email?.trim() || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-1 sm:gap-3">
      <div
        aria-label={`Usuario ${user?.firstName ?? user?.email ?? "actual"}`}
        className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted text-sm font-semibold xl:hidden"
      >
        {initial}
      </div>

      <div className="hidden max-w-52 min-w-0 text-right xl:block">
        <p className="truncate text-sm font-medium">
          {user?.firstName}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {user?.email}
        </p>
      </div>

      <LogoutButton />
    </div>
  );
}
