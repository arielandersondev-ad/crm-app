"use client";

import { useAuthStore } from "@/stores/auth.store";

export function TenantSelector() {
  const tenant = useAuthStore(
    (state) => state.tenant
  );

  return (
    <div className="rounded-md border px-3 py-2 text-sm">
      {tenant?.name ?? "Sin empresa"}
    </div>
  );
}