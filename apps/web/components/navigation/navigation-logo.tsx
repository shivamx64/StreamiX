import Link from "next/link";
import { Clapperboard } from "lucide-react";

export function NavigationLogo() {
	return (
		<Link
			href="/"
			className="group inline-flex items-center gap-2.5"
		>
			<span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm transition group-hover:bg-primary/90">
				<Clapperboard className="h-4.5 w-4.5" strokeWidth={2.5} />
			</span>
			<span className="font-display text-base font-semibold tracking-tight text-foreground">
				StreamiX
			</span>
		</Link>
	);
}