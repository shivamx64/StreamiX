import type { ReactNode } from "react";
import { Cpu, Film, ShieldCheck } from "lucide-react";

import { AuthLogo } from "@/components/auth/auth-logo";
import { ThemeToggle } from "@/components/shared-ui/theme-toggle";

type AuthLayoutProps = {
  children: ReactNode;
};

const highlights = [
  {
    icon: Film,
    title: "Adaptive HLS transcoding",
    description: "1080p, 720p, and 480p renditions generated automatically.",
  },
  {
    icon: Cpu,
    title: "Distributed worker fleet",
    description: "Jobs fan out across Redis-backed workers in parallel.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description: "JWT authentication with server-side session revocation.",
  },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex flex-col bg-background">
        <header className="flex items-center justify-between px-6 py-6 md:px-10">
          <AuthLogo />
          <ThemeToggle className="border border-border" />
        </header>

        <main className="flex flex-1 items-center justify-center px-6 py-10 md:px-10">
          <div className="w-full max-w-md">{children}</div>
        </main>

        <footer className="px-6 py-6 md:px-10">
          <p className="text-center text-sm text-muted-foreground lg:text-left">
            © {new Date().getFullYear()} StreamiX, Inc. All rights reserved.
          </p>
        </footer>
      </div>

      <aside className="relative hidden overflow-hidden bg-stone-950 lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-primary/25 blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-orange-500/15 blur-[120px]"
        />

        <div className="relative px-12 py-12">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            Distributed media pipeline
          </p>
        </div>

        <div className="relative px-12 pb-16">
          <h2 className="font-display max-w-md text-3xl font-semibold leading-tight tracking-tight text-white">
            Upload once. Stream everywhere.
          </h2>

          <p className="mt-4 max-w-md text-sm leading-6 text-white/60">
            Your account connects directly to the same pipeline that powers
            adaptive streaming for every StreamiX project.
          </p>

          <ul className="mt-10 space-y-6">
            {highlights.map((highlight) => (
              <li key={highlight.title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-primary">
                  <highlight.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {highlight.title}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-white/50">
                    {highlight.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative border-t border-white/10 px-12 py-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            Go · Redis Streams · FFmpeg · PostgreSQL
          </p>
        </div>
      </aside>
    </div>
  );
}
