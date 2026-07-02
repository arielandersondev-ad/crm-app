"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { LandingNavbar } from "@/shared/components/landing/landing-navbar";
import { LandingHero } from "@/shared/components/landing/landing-hero";
import { LandingFeatures } from "@/shared/components/landing/landing-features";
import { LandingFooter } from "@/shared/components/landing/landing-footer";
import { ChatWidget } from "@/shared/components/chat-widget/chat-widget";
import {BackgroundGrid} from "@/shared/components/landing/background-grid";

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info(
        "💬 ¿Tienes dudas? Usa nuestro asistente virtual para consultar horarios, servicios y más. ¡Estamos aquí para ayudarte!",
        {
          duration: 3000,
        }
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col landing-bg">
      <BackgroundGrid />
      <LandingNavbar />
      <main className="flex-1 relative z-10">
        <LandingHero />
        <LandingFeatures />
      </main>
      <LandingFooter />
      <ChatWidget
        mode="landing"
        tenantSlug={process.env.NEXT_PUBLIC_TENANT_SLUG}
      />
    </div>
  );
}
