import { Clapperboard, Globe, Mail } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function ApplicationFooter() {
  return (
    <footer className="bg-stone-950 text-stone-300">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                <Clapperboard className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                StreamiX
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-stone-400">
              A distributed video transcoding and streaming platform
              built to handle content at any scale.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="mailto:support@streamix.dev"
                aria-label="Email StreamiX"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-stone-400 transition hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="StreamiX website"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-stone-400 transition hover:border-primary hover:text-primary"
              >
                <Globe className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                {column.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-stone-500">
            © {new Date().getFullYear()} StreamiX, Inc. All rights reserved.
          </p>
          <p className="text-sm text-stone-500">
            Made for the engineers behind the stream.
          </p>
        </div>
      </div>
    </footer>
  );
}