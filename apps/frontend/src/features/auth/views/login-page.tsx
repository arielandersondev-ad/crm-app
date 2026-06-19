'use client'
import Link from "next/link";

import {
  Activity,
  Orbit,
  ShieldCheck,
  Users,
} from "lucide-react";

import { LoginForm } from "../components/login-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";

export function LoginPage() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null;
  }
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Brand Panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/20 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-chart-2/10 blur-3xl"
        />

        <div className="relative flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <Orbit className="size-5.5 text-primary" />
          </div>

          <span className="text-lg font-semibold">
            Alto's System
          </span>
        </div>

        <div className="relative space-y-6">
          <h1 className="max-w-md text-balance text-3xl font-semibold leading-tight tracking-tight">
            La plataforma para gestionar visitas.
          </h1>

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="size-4" />
              </span>

              Clientes, mascotas y expedientes en un solo lugar
            </li>

            <li className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="size-4" />
              </span>

              Agenda, inventario y ventas conectados
            </li>

            <li className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-4" />
              </span>

              Multi-sucursal y control de roles
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground">
          © 2026 Alto's System. Todos los derechos reservados.
        </p>
      </section>

      {/* Form Section */}
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                <Orbit className="size-5 text-primary" />
              </div>

              <span className="font-semibold">
                Alto's System
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Inicia sesión
            </h2>

            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder al panel.
            </p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            ¿Problemas para acceder?{" "}
            <Link
              href="#"
              className="text-primary hover:underline"
            >
              Contacta a soporte
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}