const companies = [
  "Streamline",
  "CineCore",
  "PulseCast",
  "NovaVision",
  "FrameWorks",
  "Vantage",
];

export function HeroSocialProof() {
  return (
    <div className="mt-20 w-full">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Trusted by 1,200+ streaming teams
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {companies.map((company) => (
          <span
            key={company}
            className="text-lg font-bold tracking-tight text-muted-foreground/40"
          >
            {company}
          </span>
        ))}
      </div>
    </div>
  );
}
