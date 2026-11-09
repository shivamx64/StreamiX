import type { ReactNode } from "react";

import { ApplicationFooter } from "@/components/landing-page/footer/application-footer";
import { ApplicationNavigationBar } from "@/components/navigation/application-navigation-bar";

type MarketingLayoutProps = {
  children: ReactNode;
};

export default function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <ApplicationNavigationBar />
      <main id="main-content">{children}</main>
      <ApplicationFooter />
    </>
  );
}
