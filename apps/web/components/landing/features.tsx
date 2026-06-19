import {
  Activity,
  Database,
  Cpu,
  Video,
} from "lucide-react";

const features = [
  {
    title: "Distributed Processing",
    description:
      "Scale video processing horizontally using worker nodes.",
    icon: Cpu,
  },
  {
    title: "Object Storage",
    description:
      "Store original and transcoded media reliably in S3.",
    icon: Database,
  },
  {
    title: "Realtime Monitoring",
    description:
      "Observe jobs, workers and system health instantly.",
    icon: Activity,
  },
  {
    title: "Adaptive Streaming",
    description:
      "Generate HLS streams optimized for every device.",
    icon: Video,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-32"
    >
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold tracking-tight">
          Designed for scale.
        </h2>

        <p className="mt-4 text-lg text-stone-600">
          Everything needed for modern media workflows.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="border border-stone-200 rounded-2xl bg-white p-8"
            >
              <feature.icon className="w-6 h-6 text-orange-500" />

              <h3 className="mt-5 text-2xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-stone-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}