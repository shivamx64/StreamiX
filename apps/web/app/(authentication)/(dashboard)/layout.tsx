"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  Video,
  LogOut,
} from "lucide-react";

import { useAuthenticationContext } from "@/providers/authentication-provider";
import { cn } from "@/lib/class-name";
import { ApplicationContainer } from "@/components/ui/application-container";
import { Button } from "@/components/ui/button";

const dashboardNavigationItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    label: "Video library",
    href: "/dashboard/videos",
    icon: Video,
  },
];

function DashboardNavigation() {
  const pathname = usePathname();
  const { logout } = useAuthenticationContext();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-muted/30 lg:flex">
      <div className="flex h-16 items-center border-b border-border/60 px-6">
        <Link
          href="/dashboard"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          StreamiX
        </Link>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="flex-1 space-y-1 p-4"
      >
        {dashboardNavigationItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
                isActive &&
                  "bg-accent text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}

function DashboardMobileNavigation() {
  const { logout } = useAuthenticationContext();

  return (
    <div className="flex items-center gap-1 lg:hidden">
      {dashboardNavigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
        >
          {item.label}
        </Link>
      ))}

      <Button
        variant="ghost"
        size="sm"
        className="ml-2 text-muted-foreground"
        onClick={logout}
        aria-label="Log out"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardNavigation />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
          <ApplicationContainer>
            <div className="flex h-16 items-center justify-between lg:h-16">
              <Link
                href="/dashboard"
                className="text-lg font-bold tracking-tight text-foreground lg:hidden"
              >
                StreamiX
              </Link>

              <div className="hidden text-sm text-muted-foreground lg:block">
                Video processing dashboard
              </div>

              <DashboardMobileNavigation />
            </div>
          </ApplicationContainer>
        </header>

        <main className="flex-1">
          <ApplicationContainer className="py-8 lg:py-10">
            {children}
          </ApplicationContainer>
        </main>
      </div>
    </div>
  );
}