"use client";

import { Menu } from "lucide-react";

import { useUIStore } from "@/stores/ui.store";

import { TenantSelector } from "./tenant-selector";
import { BranchSelector } from "./branch-selector";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const toggleSidebar = useUIStore(
    (state) => state.toggleSidebar
  );

  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar}>
          <Menu />
        </button>

        <TenantSelector />

        <BranchSelector />
      </div>

      <UserMenu />
    </header>
  );
}