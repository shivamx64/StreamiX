"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { navigationItems } from "./navigation-links";
import { NavigationLogo } from "./navigation-logo";

export function MobileNavigationSheet() {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", handleKeyDown);
			triggerRef.current?.focus();
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
				className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground md:hidden"
			>
				<Menu className="h-5 w-5" />
			</button>

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
							role="dialog"
							aria-modal="true"
							aria-label="Navigation menu"
							id="mobile-navigation-menu"
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{
								type: "spring",
								damping: 30,
								stiffness: 300,
							}}
							className="fixed inset-y-0 right-0 z-[70] flex w-[85%] max-w-sm flex-col border-l border-border bg-background p-6 md:hidden"
						>
							<div className="flex items-center justify-between">
								<NavigationLogo />
								<button
									ref={closeButtonRef}
									type="button"
									onClick={() => setOpen(false)}
									aria-label="Close navigation menu"
									className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground"
								>
									<X className="h-5 w-5" />
								</button>
							</div>

							<nav
								aria-label="Mobile navigation"
								className="mt-10 flex flex-col gap-1"
							>
								{navigationItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										onClick={() => setOpen(false)}
										className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition hover:bg-accent hover:text-accent-foreground"
									>
										{item.label}
									</Link>
								))}
							</nav>

							<div className="mt-auto flex flex-col gap-3">
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
										Start Free
									</Link>
								</Button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
