"use client"

import { ReactNode } from "react"

import { ThemeProvider } from "./theme-provider"
import { ApplicationQueryProvider } from "./query-client-provider"

type Props = {
	children: ReactNode
}

export function ApplicationProviders({
	children,
}: Props) {
	return (
		<ThemeProvider>
			<ApplicationQueryProvider>
				{children}
			</ApplicationQueryProvider>
		</ThemeProvider>
	)
}