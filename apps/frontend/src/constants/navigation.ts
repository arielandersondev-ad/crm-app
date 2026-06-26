import {
  Home,
  Users,
  Calendar,
  Package,
  Stethoscope,
  ShieldUser,
} from "lucide-react";

export const navigation = [
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
    label: "Personal",
    href: "/dashboard/usuarios",
    icon: ShieldUser,
  },
];