import {
  Home,
  Users,
  Calendar,
  Package,
  Stethoscope,
  ShieldUser,
  FileText,
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
  {
    label: "Servicios",
    href: "/dashboard/servicios",
    icon: Package,
  },
  {
    label: "Consultas",
    href: "/dashboard/visitas",
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
    label: "Personal",
    href: "/dashboard/usuarios",
    icon: ShieldUser,
    roles: ["ADMIN", "OWNER"],
  },
];