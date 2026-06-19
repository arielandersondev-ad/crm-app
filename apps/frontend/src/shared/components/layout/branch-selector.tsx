"use client";

import { useAuthStore } from "@/stores/auth.store";

export function BranchSelector() {
  const branch = useAuthStore(
    (state) => state.branch
  );

  return (
    <div className="rounded-md border px-3 py-2 text-sm">
      {branch?.name ?? "Sin sucursal"}
    </div>
  );
}