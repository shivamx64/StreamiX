import Link from "next/link";

const navigationItems = [
	{
		label: "Features",
		href: "#features",
	},
	{
		label: "Pricing",
		href: "#pricing",
	},
	{
		label: "Docs",
		href: "/docs",
	},
];

export function NavigationLinks() {
	return (
		<nav className="hidden items-center gap-8 md:flex">
			{navigationItems.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className="text-sm text-neutral-600 transition hover:text-black"
				>
					{item.label}
				</Link>
			))}
		</nav>
	);
}