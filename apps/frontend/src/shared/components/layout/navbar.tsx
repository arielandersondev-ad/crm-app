"use client";

import { Menu } from "lucide-react";

import { useUIStore } from "@/stores/ui.store";

import { TenantSelector } from "./tenant-selector";
import { BranchSelector } from "./branch-selector";
import { UserMenu } from "./user-menu";
import { ModeToggle } from "../ui/mode-toggle";

export function Navbar() {
  const toggleSidebar = useUIStore(
    (state) => state.toggleSidebar
  );

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-3 sm:h-16 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Abrir o cerrar menú principal"
          className="shrink-0 rounded-md p-2 hover:bg-muted"
          onClick={toggleSidebar}
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <TenantSelector />
          <BranchSelector />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
