import Link from "next/link";

export const navigationItems = [
	{
		label: "Features",
		href: "#features",
	},
	{
		label: "Pricing",
		href: "#pricing",
	},
	{
		label: "FAQ",
		href: "#faq",
	},
	{
		label: "Docs",
		href: "/docs",
	},
];

export function NavigationLinks() {
	return (
		<nav
			aria-label="Main navigation"
			className="hidden items-center gap-1 md:flex"
		>
			{navigationItems.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
				>
					{item.label}
				</Link>
			))}
		</nav>
	);
}
