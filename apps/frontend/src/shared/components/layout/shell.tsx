"use client";

import { ReactNode } from "react";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { ChatWidget } from "../chat-widget/chat-widget";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
      <ChatWidget mode="crm" />
    </div>
  );
}
