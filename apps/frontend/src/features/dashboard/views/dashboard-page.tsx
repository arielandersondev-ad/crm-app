"use client";

import { useAuthStore } from "@/stores/auth.store";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const tenant = useAuthStore((state) => state.tenant);
  const branch = useAuthStore((state) => state.branch);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Bienvenido nuevamente.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Usuario</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {user?.firstName} {user?.lastName}
          </p>

          <p className="text-sm text-muted-foreground">
            {user?.email}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Tenant</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {tenant?.name}
          </p>

          {/* <p className="text-sm text-muted-foreground">
            {tenant?.plan}
          </p> */}
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-medium">Sucursal</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {branch?.name}
          </p>
        </div>
      </div>
    </div>
  );
}