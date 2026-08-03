"use client"

import { MotionConfig } from "framer-motion"
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
			<MotionConfig reducedMotion="user">
				<ApplicationQueryProvider>
					{children}
				</ApplicationQueryProvider>
			</MotionConfig>
		</ThemeProvider>
	)
}