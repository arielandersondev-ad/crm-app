import {
  Home,
  Users,
  Calendar,
  //Package,
  Stethoscope,
  ShieldUser,
  FileText,
  HelpCircle,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
  roles?: string[];
}

export const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Pacientes",
    href: "/dashboard/clientes",
    icon: Users,
  },
  /* 
  {
    label: "Servicios",
    href: "/dashboard/servicios",
    icon: Package,
  },
  {
    label: "Consultas (Visitas)",
    href: "/dashboard/visitas",
    icon: Stethoscope,
   }, */
  {
    label: "Consultas Clínicas",
    href: "/dashboard/consultas",
    icon: Stethoscope,
  },
  {
    label: "Agenda / Controles",
    href: "/dashboard/agenda",
    icon: Calendar,
  },
  {
    label: "Reportes",
    href: "/dashboard/reportes",
    icon: FileText,
    roles: ["ADMIN", "OWNER", "EMPLOYEE", "MANAGER"],
  },
  {
    label: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
    roles: ["ADMIN", "OWNER"],
  },
  {
    label: "FAQ Chatbot",
    href: "/dashboard/faqs",
    icon: HelpCircle,
    roles: ["ADMIN", "OWNER", "MANAGER"],
  },
  {
    label: "Personal",
    href: "/dashboard/usuarios",
    icon: ShieldUser,
    roles: ["ADMIN", "OWNER"],
  },
];