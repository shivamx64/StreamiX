import type { HTMLAttributes } from "react";

import { cn } from "@/lib/class-name";

type ApplicationContainerProps = HTMLAttributes<HTMLDivElement>;

export function ApplicationContainer({
	className,
	children,
	...props
}: ApplicationContainerProps) {
	return (
		<div
			className={cn(
				"mx-auto w-full max-w-7xl px-6 lg:px-8",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}