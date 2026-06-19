import { ReactNode } from "react";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#f8f7f4]">

      <Sidebar />

      <div className="ml-64 min-h-screen">

        <Navbar />

        <main className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </main>

      </div>

    </div>
  );
}