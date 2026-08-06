"use client";

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
  const { logout } = useAuthenticationContext();
  const { data: user } = useUserProfile();
  const { data: videos } = useVideos();

  const videoCount = videos?.length ?? 0;
  const storageUsed = formatBytes(
    videos?.reduce((sum, video) => sum + video.size, 0) ?? 0,
  );

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-muted/30 lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/60 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-none bg-primary text-primary-foreground">
          <Clapperboard className="h-4.5 w-4.5" />
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

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = isItemActive(item, pathname);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex items-center gap-3 border-l-2 py-2 pl-[14px] pr-4 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border/60 px-4 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              <Video className="h-3.5 w-3.5" />
              Videos
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {videoCount}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              <HardDrive className="h-3.5 w-3.5" />
              Storage
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {storageUsed}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-border/60 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-border bg-accent text-xs font-bold text-accent-foreground">
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
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground",
              isItemActive(item, pathname) &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
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
            <PageTransition key={pathname}>
              {children}
            </PageTransition>
          </ApplicationContainer>
        </main>
      </div>
    </div>
  );
}