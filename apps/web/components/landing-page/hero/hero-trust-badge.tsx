import { CheckCircle2 } from "lucide-react";

const trustPoints = [
  "No credit card required",
  "Free forever for personal projects",
  "Live processing in under a minute",
];

export function HeroTrustBadge() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
      {trustPoints.map((point) => (
        <div
          key={point}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <CheckCircle2 className="h-4 w-4 text-primary" />
          {point}
        </div>
      ))}
    </div>
  );
}