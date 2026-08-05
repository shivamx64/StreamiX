"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clapperboard,
  LayoutDashboard,
  LogOut,
  Upload,
  Video,
} from "lucide-react";

import { useAuthenticationContext } from "@/providers/authentication-provider";
import { useUserProfile } from "@/hooks/use-user-profile";
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

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/upload": "Upload video",
  "/dashboard/videos": "Video library",
};

function userInitials(email?: string): string {
  if (!email) return "U";
  const local = email.split("@")[0] ?? "";
  const parts = local.replace(/[._-]/g, " ").split(" ");
  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "U";
}

function DashboardNavigation() {
  const pathname = usePathname();
  const { logout } = useAuthenticationContext();
  const { data: user } = useUserProfile();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-muted/30 lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/60 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Clapperboard className="h-5 w-5" />
        </span>

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
                  "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        <div className="flex items-center gap-3 px-1.5 py-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
            {userInitials(user?.email)}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {user?.email ?? "Account"}
            </p>
            <p className="text-xs text-muted-foreground">Free plan</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="mt-1 w-full justify-start gap-3 text-muted-foreground"
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
  const pathname = usePathname();

  let title = "Overview";
  for (const [prefix, label] of Object.entries(pageTitles)) {
    if (pathname.startsWith(prefix)) {
      title = label;
      break;
    }
  }

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

              <div className="hidden text-sm font-medium text-muted-foreground lg:block">
                <span className="text-foreground">{title}</span>
                <span className="mx-2 text-border">/</span>
                <span>StreamiX</span>
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