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
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}