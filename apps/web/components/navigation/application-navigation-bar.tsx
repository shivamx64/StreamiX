import { ApplicationContainer } from "@/components/ui/application-container";

import { MobileNavigationSheet } from "./mobile-navigation-sheet";
import { NavigationActions } from "./navigation-actions";
import { NavigationLinks } from "./navigation-links";
import { NavigationLogo } from "./navigation-logo";

export function ApplicationNavigationBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <ApplicationContainer className="max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          <NavigationLogo />
          <NavigationLinks />
          <NavigationActions />
          <MobileNavigationSheet />
        </div>
      </ApplicationContainer>
    </header>
  );
}
