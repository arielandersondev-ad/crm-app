"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Calendar, Eye } from "lucide-react";

export function LandingHero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center md:py-32">
      <div className="flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-8">
        <Eye className="size-4 text-primary" />
        <span>Oftalmológica K &amp; Y — Cuidamos tu visión</span>
      </div>

      <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Tu clínica oftalmológica
        <span className="text-primary"> en un solo lugar</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        En Oftalmológica K &amp; Y brindamos atención visual personalizada con
        tecnología de punta. Desde la medida y graduación de tus lentes hasta el
        asesoramiento médico especializado, cuidamos tu visión con calidez y
        profesionalismo.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        {/* <Button asChild size="lg">
          <Link href="/login">
            <Calendar className="mr-2 size-5" />
            Agenda tu cita
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Iniciar Sesión</Link>
        </Button> */}
      </div>
    </section>
  );
}
