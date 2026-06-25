import {
  Home,
  Users,
  Calendar,
  Package,
  Disc,
  ShieldUser,
} from "lucide-react";

export const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Clientes",
    href: "/dashboard/clientes",
    icon: Users,
  },
  {
    label: "Servicios",
    href: "/dashboard/servicios",
    icon: Package,
  },
  {
    label: "Visitas",
    href: "/dashboard/visitas",
    icon: Disc,
   },
  {
    label: "Agenda",
    href: "/dashboard/agenda",
    icon: Calendar,
  },
  {
    label: "Usuarios",
    href: "/dashboard/usuarios",
    icon: ShieldUser,
  },
];