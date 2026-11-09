import { Clapperboard, GitBranch } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/#product" },
      { label: "Pipeline", href: "/#pipeline" },
      { label: "Architecture", href: "/#architecture" },
      { label: "Capabilities", href: "/#features" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      {
        label: "GitHub",
        href: "https://github.com/shivamx64/StreamiX",
        external: true,
      },
      {
        label: "Issues",
        href: "https://github.com/shivamx64/StreamiX/issues",
        external: true,
      },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/signup" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export function ApplicationFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#12100e] text-stone-400">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Clapperboard className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-[#f5f1e8]">
                StreamiX
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-stone-400">
              A self-hosted pipeline for uploads, FFmpeg transcoding, adaptive
              HLS, and authenticated playback.
            </p>

            <Link
              href="https://github.com/shivamx64/StreamiX"
              target="_blank"
              rel="noreferrer"
              aria-label="StreamiX on GitHub"
              className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-stone-400 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <GitBranch className="h-4 w-4" />
            </Link>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-stone-400">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="text-[13px] text-stone-400 transition-colors hover:text-[#f5f1e8]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-[11px] text-stone-400">
            © {new Date().getFullYear()} StreamiX. Public repository.
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-stone-400">
            Next.js · Go · Redis Streams · FFmpeg
          </p>
        </div>
      </div>
    </footer>
  );
}
