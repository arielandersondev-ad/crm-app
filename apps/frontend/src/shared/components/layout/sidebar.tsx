"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/constants/navigation";
import { useUIStore } from "@/stores/ui.store";

export function Sidebar() {
  const pathname = usePathname();

  const sidebarOpen = useUIStore(
    (state) => state.sidebarOpen
  );

  return (
    <aside
      className={`
        border-r bg-background transition-all
        ${sidebarOpen ? "w-64" : "w-20"}
      `}
    >
      <div className="flex h-16 items-center px-4 font-bold">
        {sidebarOpen ? "Alto's System" : "AS"}
      </div>

      <nav className="space-y-1 p-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-md px-3 py-2
                ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }
              `}
            >
              <Icon size={18} />

              {sidebarOpen && (
                <span>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}