"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useDashboardStats } from "../hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users, CalendarClock, Stethoscope, DollarSign, Clock } from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 animate-pulse rounded bg-muted" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const tenant = useAuthStore((state) => state.tenant);
  const branch = useAuthStore((state) => state.branch);
  const { data: stats, isLoading, isError } = useDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido nuevamente, {user?.firstName ?? "usuario"}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pacientes"
          value={stats?.totalClients.toLocaleString() ?? "0"}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          title="Citas Hoy"
          value={stats?.todayAppointments.toLocaleString() ?? "0"}
          icon={CalendarClock}
          loading={isLoading}
        />
        <StatCard
          title="Consultas Hoy"
          value={stats?.todayVisits.toLocaleString() ?? "0"}
          icon={Stethoscope}
          loading={isLoading}
        />
        {/* Comentado: Ingresos no aplica al dominio clínico
        <StatCard
          title="Ingresos Hoy"
          value={`$${stats?.todayRevenue.toLocaleString() ?? "0"}`}
          icon={DollarSign}
          loading={isLoading}
        />
        */}
        <StatCard
          title="Citas Pendientes"
          value={stats?.pendingAppointments.toLocaleString() ?? "0"}
          icon={Clock}
          loading={isLoading}
        />
      </div>

      {isError && (
        <p className="text-sm text-destructive">
          Error al cargar estadísticas. Intente nuevamente.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Usuario</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{user?.firstName} {user?.lastName}</p>
            <p>{user?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenant</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{tenant?.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sucursal</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{branch?.name}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}