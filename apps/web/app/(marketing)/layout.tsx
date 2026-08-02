import type { ReactNode } from "react";

import { ApplicationFooter } from "@/components/footer/application-footer";
import { ApplicationNavigationBar } from "@/components/navigation/application-navigation-bar";

type MarketingLayoutProps = {
	children: ReactNode;
};

export default function MarketingLayout({
	children,
}: MarketingLayoutProps) {
	return (
		<>
			<ApplicationNavigationBar />

			<main>{children}</main>

			<ApplicationFooter />
		</>
	);
}