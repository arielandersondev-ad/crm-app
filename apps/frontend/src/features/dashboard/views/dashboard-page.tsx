"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useDashboardStats } from "../hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users, CalendarClock, CalendarCheck, Clock, Activity, Stethoscope, FileText } from "lucide-react";
import Link from "next/link";

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          value={stats?.todayConsultations.toLocaleString() ?? "0"}
          icon={Stethoscope}
          loading={isLoading}
        />
        <StatCard
          title="Consultas Totales"
          value={stats?.totalConsultations.toLocaleString() ?? "0"}
          icon={Activity}
          loading={isLoading}
        />
        <StatCard
          title="Próximos Controles"
          value={stats?.upcomingControls.toLocaleString() ?? "0"}
          icon={CalendarCheck}
          loading={isLoading}
        />
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

      <div className="grid gap-4 md:grid-cols-4">
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

        <Link href="/dashboard/reportes">
          <Card className="h-full cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-4" />
                Reportes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Generar reportes clínicos en PDF</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
