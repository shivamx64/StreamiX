const stack = [
  "Go",
  "Gin",
  "PostgreSQL",
  "Redis Streams",
  "FFmpeg",
  "Next.js",
  "Tailwind CSS",
];

export function TechStackStrip() {
  return (
    <section
      aria-label="Technology stack"
      className="border-y border-border/60 bg-muted/20 py-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-5 px-6 md:px-10 lg:px-12">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
          The pipeline is built on
        </p>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {stack.map((item) => (
            <li
              key={item}
              className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
