"use client";

import { Glasses, ShoppingBag, Stethoscope, MapPin } from "lucide-react";

const services = [
  {
    icon: Glasses,
    title: "Medida y Graduación de Lentes",
    description: "Examen visual completo con refracción digital para una prescripción precisa y adaptada a tus necesidades.",
  },
  {
    icon: ShoppingBag,
    title: "Venta de Monturas",
    description: "Amplia variedad de monturas modernas y clásicas. Encuentra el estilo que mejor se adapte a tu personalidad.",
  },
  {
    icon: Stethoscope,
    title: "Asesoramiento Médico",
    description: "Evaluación personalizada por nuestros especialistas en salud visual. Diagnóstico temprano y tratamiento oportuno.",
  },
  {
    icon: MapPin,
    title: "Ubicación",
    description: "Estamos ubicados en el centro de la ciudad. Atención con cita previa para brindarte el mejor servicio.",
  },
];

export function LandingFeatures() {
  return (
    <section className="border-t bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Todo lo que necesitas en un solo lugar
        </h2>
        <p className="mt-4 text-center text-muted-foreground">
          Evaluación personalizada y adecuada al cliente.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-lg border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <service.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
