import { ApplicationContainer } from "@/components/ui/application-container";

import { NavigationActions } from "./navigation-actions";
import { NavigationLinks } from "./navigation-links";
import { NavigationLogo } from "./navigation-logo";
import { MobileNavigationSheet } from "./mobile-navigation-sheet";

export function ApplicationNavigationBar() {
	return (
		<header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
			<ApplicationContainer>
				<div className="flex h-16 items-center justify-between lg:h-20">
					<NavigationLogo />
					<NavigationLinks />
					<NavigationActions />
					<MobileNavigationSheet />
				</div>
			</ApplicationContainer>
		</header>
	);
}
