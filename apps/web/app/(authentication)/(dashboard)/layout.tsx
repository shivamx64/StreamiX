"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Clapperboard,
  HardDrive,
  LayoutDashboard,
  LogOut,
  Upload,
  Video,
} from "lucide-react";

import { useAuthenticationContext } from "@/providers/authentication-provider";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useVideos } from "@/hooks/use-video-processing";
import { cn } from "@/lib/class-name";
import { formatBytes } from "@/lib/format";
import { ApplicationContainer } from "@/components/ui/application-container";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared-ui/page-transition";
import { ThemeToggle } from "@/components/shared-ui/theme-toggle";

// Free-plan quota shown in the sidebar meter. The backend does not
// enforce quotas yet; this mirrors the Starter plan copy.
const FREE_PLAN_STORAGE_BYTES = 2 * 1024 * 1024 * 1024;

type NavigationItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  external?: boolean;
};

type NavigationSection = {
  label: string;
  items: NavigationItem[];
};

const navigationSections: NavigationSection[] = [
  {
    label: "General",
    items: [
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
    ],
  },
  {
    label: "Library",
    items: [
      {
        label: "Video library",
        href: "/dashboard/videos",
        icon: Video,
      },
      {
        label: "Documentation",
        href: "/docs",
        icon: BookOpen,
        external: true,
      },
    ],
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

function isItemActive(item: NavigationItem, pathname: string): boolean {
  return item.href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname.startsWith(item.href);
}

function DashboardNavigation() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { logout } = useAuthenticationContext();
  const { data: user } = useUserProfile();
  const { data: videos } = useVideos();

  const videoCount = videos?.length ?? 0;
  const storageUsed = videos?.reduce((sum, video) => sum + video.size, 0) ?? 0;
  const storagePercent = Math.min(
    100,
    (storageUsed / FREE_PLAN_STORAGE_BYTES) * 100,
  );

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-muted/20 lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/60 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
          <Clapperboard className="h-4.5 w-4.5" strokeWidth={2.5} />
        </span>

        <Link
          href="/dashboard"
          className="font-display text-base font-semibold tracking-tight text-foreground"
        >
          StreamiX
        </Link>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="flex-1 overflow-y-auto pb-4"
      >
        {navigationSections.map((section) => (
          <div key={section.label}>
            <p className="px-5 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              {section.label}
            </p>

            <div className="space-y-0.5 px-3">
              {section.items.map((item) => {
                const isActive = isItemActive(item, pathname);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-md py-2 pl-3 pr-4 text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={reduceMotion ? undefined : "dashboard-nav-active"}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                        className="absolute inset-0 rounded-md border border-primary/20 bg-primary/10"
                        aria-hidden="true"
                      />
                    )}

                    <item.icon className="relative h-4 w-4" />
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/60 px-4 py-4">
        <div className="rounded-md border border-border/60 bg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              <Video className="h-3.5 w-3.5" />
              Videos
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {videoCount}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              <HardDrive className="h-3.5 w-3.5" />
              Storage
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {formatBytes(storageUsed)}
            </span>
          </div>

          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${Math.max(storagePercent, 1.5)}%` }}
            />
          </div>

          <p className="mt-2 text-[11px] text-muted-foreground">
            of {formatBytes(FREE_PLAN_STORAGE_BYTES)} on the free plan
          </p>
        </div>

        <div className="mt-4 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-accent text-xs font-bold text-accent-foreground">
                {userInitials(user?.email)}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {user?.email ?? "Account"}
                </p>
                <p className="text-xs text-muted-foreground">Free plan</p>
              </div>
            </div>

            <ThemeToggle className="h-8 w-8 rounded-md" />
          </div>

          <Button
            variant="ghost"
            className="mt-2 w-full justify-start gap-3 rounded-md text-muted-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </aside>
  );
}

function DashboardMobileNavigation() {
  const { logout } = useAuthenticationContext();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 lg:hidden">
      {navigationSections
        .flatMap((section) => section.items)
        .filter((item) => !item.external)
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isItemActive(item, pathname) ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
              isItemActive(item, pathname) &&
                "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary",
            )}
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

      <ThemeToggle className="ml-1 h-8 w-8 border border-border" />
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
                className="font-display text-base font-semibold tracking-tight text-foreground lg:hidden"
              >
                StreamiX
              </Link>

              <div className="hidden items-center gap-2 text-sm lg:flex">
                <span className="font-medium text-muted-foreground">
                  Dashboard
                </span>
                <span className="text-border">/</span>
                <span className="font-medium text-foreground">{title}</span>
              </div>

              <DashboardMobileNavigation />
            </div>
          </ApplicationContainer>
        </header>

        <main className="flex-1">
          <ApplicationContainer className="py-8 lg:py-10">
            <PageTransition key={pathname}>
              {children}
            </PageTransition>
          </ApplicationContainer>
        </main>
      </div>
    </div>
  );
}
