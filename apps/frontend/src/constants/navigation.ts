import {
  Home,
  Users,
  PawPrint,
  Calendar,
  Package,
  ShoppingCart,
  Settings,
  Disc,
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
    label: "Mascotas",
    href: "/mascotas",
    icon: PawPrint,
  },
  {
    label: "Agenda",
    href: "/agenda",
    icon: Calendar,
  },
  {
    label: "Ventas",
    href: "/ventas",
    icon: ShoppingCart,
  },
  {
    label: "Inventario",
    href: "/inventario",
    icon: Package,
  },
  {
    label: "Configuración",
    href: "/configuracion",
    icon: Settings,
  },
];