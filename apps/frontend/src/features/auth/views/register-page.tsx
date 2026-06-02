'use client'
import Link from "next/link";

import {
  Orbit,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect } from "react";
import { RegisterForm } from "../components/register-form";

export function RegisterPage() {
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
    <main className="grid min-h-screen lg:grid-cols-1">

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
              Regístrate
            </h2>

            <p className="text-sm text-muted-foreground">
              Regístrate de manera fácil y segura.
            </p>
          </div>

          <RegisterForm />

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