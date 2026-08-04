"use client"

import { MotionConfig } from "framer-motion"
import { ReactNode } from "react"

import { AuthenticationProvider } from "./authentication-provider"
import { ApplicationQueryProvider } from "./query-client-provider"

type Props = {
	children: ReactNode
}

export function ApplicationProviders({
	children,
}: Props) {
	return (
		<MotionConfig reducedMotion="user">
			<ApplicationQueryProvider>
				<AuthenticationProvider>
					{children}
				</AuthenticationProvider>
			</ApplicationQueryProvider>
		</MotionConfig>
	)
}