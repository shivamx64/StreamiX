"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { ThemeToggle } from "@/components/shared-ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthenticationContext } from "@/providers/authentication-provider";

import { navigationItems } from "./navigation-links";
import { NavigationLogo } from "./navigation-logo";

const focusableSelector =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const emptySubscribe = () => () => {};

export function MobileNavigationSheet() {
  const { tokens, isReady } = useAuthenticationContext();
  const [open, setOpen] = useState(false);
  const isAuthenticated = isReady && Boolean(tokens);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        focusableSelector,
      );

      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="mobile-navigation-menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  aria-hidden="true"
                  className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
                />

                <motion.div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Navigation menu"
                  id="mobile-navigation-menu"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 32, stiffness: 320 }}
                  className="fixed inset-y-0 right-0 z-[70] flex w-[88%] max-w-sm flex-col overflow-y-auto border-l border-border bg-background p-6 md:hidden"
                >
                  <div className="flex items-center justify-between">
                    <NavigationLogo />
                    <div className="flex items-center gap-2">
                      <ThemeToggle className="border border-border" />
                      <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close navigation menu"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-10 border-t border-border pt-6">
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                      Navigate
                    </p>

                    <nav
                      aria-label="Mobile navigation"
                      className="mt-3 flex flex-col"
                    >
                      {navigationItems.map((item, index) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-center justify-between border-b border-border/70 py-4 text-lg font-medium tracking-[-0.02em] text-foreground transition-colors hover:text-primary"
                        >
                          <span>{item.label}</span>
                          <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-primary">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </Link>
                      ))}
                    </nav>
                  </div>

                  <div className="mt-auto border-t border-border pt-6">
                    <div className="flex flex-col gap-3">
                      {isAuthenticated ? (
                        <Button asChild className="w-full">
                          <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </Button>
                      ) : (
                        <>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full"
                          >
                            <Link
                              href="/login"
                              onClick={() => setOpen(false)}
                            >
                              Log in
                            </Link>
                          </Button>
                          <Button asChild className="w-full">
                            <Link
                              href="/signup"
                              onClick={() => setOpen(false)}
                            >
                              Get started
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>

                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Go · Redis Streams · FFmpeg
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
