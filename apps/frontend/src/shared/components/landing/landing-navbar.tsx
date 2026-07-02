"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Eye className="size-6 text-primary" />
          <span>Oftalmológica K &amp; Y</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          {/* Registro deshabilitado — solo administradores crean usuarios */}
        </div>
      </div>
    </nav>
  );
}
