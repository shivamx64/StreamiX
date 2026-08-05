import Link from "next/link";

import { Button } from "@/components/ui/button";

export function NavigationActions() {
	return (
		<div className="hidden items-center gap-3 md:flex">
			<Link
				href="/login"
				className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
			>
				Log in
			</Link>

			<Button asChild size="sm">
				<Link href="/signup">
					Start Free
				</Link>
			</Button>
		</div>
	);
}