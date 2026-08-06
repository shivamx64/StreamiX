"use client"

import { MotionConfig } from "framer-motion"
import { ReactNode } from "react"

import { AuthenticationProvider } from "./authentication-provider"
import { ApplicationQueryProvider } from "./query-client-provider"
import { ThemeProvider } from "./theme-provider"

type Props = {
	children: ReactNode
}

export function ApplicationProviders({
	children,
}: Props) {
	return (
		<MotionConfig reducedMotion="user">
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<ApplicationQueryProvider>
					<AuthenticationProvider>
						{children}
					</AuthenticationProvider>
				</ApplicationQueryProvider>
			</ThemeProvider>
		</MotionConfig>
	)
}