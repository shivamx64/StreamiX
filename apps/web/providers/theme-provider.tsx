"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

/**
 * Wraps next-themes so the rest of the application
 * does not depend directly on the library.
 */
export function ThemeProvider({
	children,
	...props
}: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
			{...props}
		>
			{children}
		</NextThemesProvider>
	)
}