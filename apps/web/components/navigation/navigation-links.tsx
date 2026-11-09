"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/class-name";

export const navigationItems = [
  { label: "Product", href: "/#product" },
  { label: "Pipeline", href: "/#pipeline" },
  { label: "Architecture", href: "/#architecture" },
  { label: "FAQ", href: "/#faq" },
  { label: "Docs", href: "/docs" },
];

export function NavigationLinks() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (pathname !== "/") return;

    const ids = navigationItems
      .map((item) =>
        item.href.startsWith("/#") ? item.href.slice(2) : null,
      )
      .filter((id): id is string => Boolean(id));

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sections.length === 0) return;

    const updateActiveSection = () => {
      let current = "";

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 160) {
          current = `#${section.id}`;
        }
      }

      setActiveSection(current);
    };

    const frame = requestAnimationFrame(updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [pathname]);

  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 md:flex"
    >
      {navigationItems.map((item) => {
        const isAnchor = item.href.startsWith("/#");
        const isActive =
          pathname === "/"
            ? isAnchor && item.href.slice(1) === activeSection
            : !isAnchor && pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "relative rounded-md px-3 py-2 text-[13px] font-medium tracking-[-0.01em] text-muted-foreground transition-colors hover:text-foreground",
              "after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200 after:ease-out-expo hover:after:scale-x-100",
              isActive && "text-foreground after:scale-x-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
