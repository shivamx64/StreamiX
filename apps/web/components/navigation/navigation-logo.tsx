import Link from "next/link";

export function NavigationLogo() {
	return (
		<Link
			href="/"
			className="text-xl font-semibold tracking-tight"
		>
			StreamiX
		</Link>
	);
}