import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { applicationConfiguration } from "@/constants/application-configuration";
import { ApplicationProviders } from "@/providers/application-providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: applicationConfiguration.name,
		template: `%s | ${applicationConfiguration.name}`,
	},
	description: applicationConfiguration.description,
};

type RootLayoutProps = {
	children: React.ReactNode;
};

export default function RootLayout({
	children,
}: Readonly<RootLayoutProps>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ApplicationProviders>
					{children}
				</ApplicationProviders>
			</body>
		</html>
	);
}