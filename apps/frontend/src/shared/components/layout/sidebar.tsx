"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/constants/navigation";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";

export function Sidebar() {
  const pathname = usePathname();
  const userRole = useAuthStore((s) => s.user?.role);

  const sidebarOpen = useUIStore(
    (state) => state.sidebarOpen
  );
  const closeSidebar = useUIStore(
    (state) => state.closeSidebar
  );

  const visibleNav = userRole
    ? navigation.filter((item) => !item.roles || item.roles.includes(userRole))
    : navigation;

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col overflow-y-auto
          border-r bg-background transition-[width,transform] duration-200 md:static md:z-auto md:translate-x-0
          ${sidebarOpen ? "translate-x-0 md:w-64" : "-translate-x-full md:w-20"}
        `}
      >
        <div className="flex h-14 shrink-0 items-center px-4 font-bold sm:h-16">
          {sidebarOpen ? "Sistema Oftalmológico" : "SO"}
        </div>

        <nav className="space-y-1 p-2">
          {visibleNav.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={!sidebarOpen ? item.label : undefined}
                onClick={() => {
                  if (window.matchMedia("(max-width: 767px)").matches) {
                    closeSidebar();
                  }
                }}
                className={`
                  flex items-center gap-3 rounded-md px-3 py-2
                  ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }
                `}
              >
                <Icon className="size-[18px] shrink-0" />

                {sidebarOpen && (
                  <span>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú principal"
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
}
