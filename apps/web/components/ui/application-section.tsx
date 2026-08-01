import type { HTMLAttributes } from "react";

import { cn } from "@/lib/class-name";

type ApplicationSectionProps = HTMLAttributes<HTMLElement>;

export function ApplicationSection({
	className,
	children,
	...props
}: ApplicationSectionProps) {
	return (
		<section
			className={cn(
				"py-24 lg:py-32",
				className,
			)}
			{...props}
		>
			{children}
		</section>
	);
}