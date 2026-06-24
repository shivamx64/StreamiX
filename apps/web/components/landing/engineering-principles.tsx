const principles = [
  {
    number: "01",
    title: "Queue-Based Processing",
    description:
      "Uploads become jobs. Workers consume tasks independently, allowing transcoding capacity to scale horizontally without affecting the API layer.",
  },
  {
    number: "02",
    title: "Object Storage First",
    description:
      "Original videos, thumbnails and transcoded outputs are stored in object storage rather than application servers, improving durability and scalability.",
  },
  {
    number: "03",
    title: "Independent Scaling",
    description:
      "API requests and video processing workloads scale separately. StreamiX isolates these services so traffic spikes don't impact transcoding throughput.",
  },
  {
    number: "04",
    title: "Observable by Design",
    description:
      "Every stage of the media pipeline can be monitored, measured and inspected through logs, metrics and realtime job updates.",
  },
];

export function EngineeringPrinciples() {
  return (
    <section className="py-40 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-12 gap-16">

          {/* Left Side */}

          <div className="lg:col-span-4">

            <span className="uppercase tracking-[0.25em] text-xs text-stone-500">
              ENGINEERING DECISIONS
            </span>

            <h2 className="mt-6 font-serif text-6xl lg:text-7xl leading-[0.95]">
              Designed for
              <span className="block italic text-orange-700">
                real workloads.
              </span>
            </h2>

            <p className="mt-8 text-lg text-stone-600 leading-relaxed">
              StreamiX explores how modern media platforms are built.
              Every architectural decision is designed around scalability,
              reliability and operational simplicity.
            </p>

          </div>

          {/* Right Side */}

          <div className="lg:col-span-8">

            <div className="grid md:grid-cols-2 gap-12">

              {principles.map((item) => (
                <div
                  key={item.title}
                  className="group"
                >

                  <div className="text-orange-700 text-sm tracking-[0.3em]">
                    {item.number}
                  </div>

                  <h3 className="mt-4 font-serif text-4xl leading-none transition-colors group-hover:text-orange-700">
                    {item.title}
                  </h3>

                  <p className="mt-6 text-stone-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-8 h-px bg-stone-200" />

                </div>
              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}