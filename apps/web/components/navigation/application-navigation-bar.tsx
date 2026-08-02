import { ApplicationContainer } from "@/components/ui/application-container";

import { NavigationActions } from "./navigation-actions";
import { NavigationLinks } from "./navigation-links";
import { NavigationLogo } from "./navigation-logo";
import { MobileNavigationSheet } from "./mobile-navigation-sheet";

export function ApplicationNavigationBar() {
	return (
		<header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
			<ApplicationContainer>
				<div className="flex h-20 items-center justify-between">
					<NavigationLogo />
					<NavigationLinks />
					<NavigationActions />
					<MobileNavigationSheet />
				</div>
			</ApplicationContainer>
		</header>
	);
}