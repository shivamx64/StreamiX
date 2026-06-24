const items = [
  "Go",
  "ffmpeg",
  "Redis",
  "PostgreSQL",
  "S3",
  "Kubernetes",
  "Docker",
  "HLS",
  "Next.js",
  "Typescript",
];

export function TechStack() {
  return (
    <section className="border-y border-stone-200 overflow-hidden">
      <div className="relative flex overflow-hidden">

        <div className="flex min-w-max animate-marquee items-center py-4">
          {[...items, ...items, ...items].map((item, index) => (
            <div
              key={index}
              className="flex items-center shrink-0"
            >
              <span className="font-serif text-2xl lg:text-3xl text-stone-500 px-8 whitespace-nowrap">
                {item}
              </span>

              <span className="text-orange-700 text-sm">
                •
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}