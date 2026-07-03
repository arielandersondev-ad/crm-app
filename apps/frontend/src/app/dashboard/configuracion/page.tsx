"use client";

import { useState } from "react";
import { PageContainer } from "@/shared/components/page-container";
import { PageHeader } from "@/shared/components/page-header";
import { ConfiguracionEmpresa } from "@/features/configuracion/components/configuracion-empresa";
import { ConfiguracionSucursales } from "@/features/configuracion/components/configuracion-sucursales";
import { ConfiguracionAgenda } from "@/features/configuracion/components/configuracion-agenda";
import { ConfiguracionChatbot } from "@/features/configuracion/components/configuracion-chatbot";
import { Building2, MapPin, Calendar, Bot } from "lucide-react";

const TABS = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "sucursales", label: "Sucursales", icon: MapPin },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "chatbot", label: "Chatbot", icon: Bot },
];

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState("empresa");

  return (
    <PageContainer>
      <PageHeader
        title="Configuración"
        description="Administra la configuración general del sistema"
      />

      <div className="flex gap-1 border-b mb-6">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "empresa" && <ConfiguracionEmpresa />}
      {activeTab === "sucursales" && <ConfiguracionSucursales />}
      {activeTab === "agenda" && <ConfiguracionAgenda />}
      {activeTab === "chatbot" && <ConfiguracionChatbot />}
    </PageContainer>
  );
}
