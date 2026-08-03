import Link from "next/link";
import { Clapperboard } from "lucide-react";

export function NavigationLogo() {
	return (
		<Link
			href="/"
			className="group inline-flex items-center gap-2.5"
		>
			<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition group-hover:bg-primary/90">
				<Clapperboard className="h-5 w-5" strokeWidth={2.5} />
			</span>
			<span className="text-lg font-bold tracking-tight text-foreground">
				StreamiX
			</span>
		</Link>
	);
}