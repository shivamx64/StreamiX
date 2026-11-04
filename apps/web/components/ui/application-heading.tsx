import type { HTMLAttributes } from "react";

import { cn } from "@/lib/class-name";

type ApplicationHeadingProps =
	HTMLAttributes<HTMLHeadingElement>;

export function ApplicationHeading({
	className,
	children,
	...props
}: ApplicationHeadingProps) {
	return (
		<h1
			className={cn(
				"font-display text-6xl leading-none tracking-tight text-foreground lg:text-8xl",
				className,
			)}
			{...props}
		>
			{children}
		</h1>
	);
}