import { Check } from "lucide-react";
import Link from "next/link";

import { MarketingSection } from "@/components/shared-ui/marketing/marketing-section";
import { MarketingSectionHeader } from "@/components/shared-ui/marketing/marketing-section-header";
import { Reveal } from "@/components/shared-ui/reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/class-name";

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: {
    label: string;
    href: string;
    variant: "default" | "outline";
  };
  highlighted: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "For personal projects and exploring StreamiX.",
    features: [
      "5 video uploads / month",
      "480p · 720p HLS outputs",
      "2 GB of storage",
      "Community support",
    ],
    cta: { label: "Get Started", href: "/signup", variant: "outline" },
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For creators shipping content at a steady pace.",
    features: [
      "Unlimited uploads",
      "Up to 1080p HLS outputs",
      "Realtime job monitoring",
      "100 GB of storage",
      "Priority support",
    ],
    cta: { label: "Start Free Trial", href: "/signup", variant: "default" },
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams that need scale, control, and support.",
    features: [
      "Unlimited everything",
      "Dedicated worker pools",
      "SSO & audit logs",
      "SLA & onboarding",
      "Custom delivery",
    ],
    cta: { label: "Contact Sales", href: "/contact", variant: "outline" },
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <MarketingSection id="pricing">
      <MarketingSectionHeader
        badge="Pricing"
        title="Simple pricing that scales with you"
        description="Start free, upgrade when you need more power. No hidden fees, no surprises — cancel anytime."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <Reveal key={plan.name} delay={index * 0.08} className="h-full">
            <Card
              className={cn(
                "relative flex h-full flex-col p-8 transition-shadow",
                plan.highlighted
                  ? "border-primary/40 shadow-xl shadow-primary/10 ring-1 ring-primary/20"
                  : "hover:shadow-md hover:shadow-foreground/5",
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-8 rounded-md bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-sm">
                  Most Popular
                </span>
              )}

              <h3 className="text-base font-semibold text-foreground">
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm",
                        plan.highlighted
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.cta.variant}
                className="mt-8 w-full"
              >
                <Link href={plan.cta.href}>
                  {plan.cta.label}
                </Link>
              </Button>
            </Card>
          </Reveal>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        All plans include HLS streaming, thumbnail generation, and 24/7
        infrastructure monitoring.
      </p>
    </MarketingSection>
  );
}