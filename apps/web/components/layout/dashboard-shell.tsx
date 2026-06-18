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
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="ml-64">
        <Navbar />

        <main className="px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}