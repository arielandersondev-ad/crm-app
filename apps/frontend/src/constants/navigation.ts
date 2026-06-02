import {
  Home,
  Users,
  PawPrint,
  Calendar,
  Package,
  ShoppingCart,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: Users,
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