const features = [
  {
    number: "01",
    title: "Distributed Workers",
    description:
      "Horizontally scalable worker nodes consume jobs from Redis Streams and process media independently.",
  },
  {
    number: "02",
    title: "Adaptive Streaming",
    description:
      "Generate HLS playlists and multiple renditions for optimal playback on every device.",
  },
  {
    number: "03",
    title: "Object Storage",
    description:
      "Store original assets, thumbnails and transcoded outputs in S3-compatible storage.",
  },
  {
    number: "04",
    title: "Realtime Visibility",
    description:
      "Monitor jobs, worker health and processing progress from a modern dashboard.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-40 border-t border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="font-serif text-6xl lg:text-8xl">
          Built for
          <span className="italic text-orange-600"> systems.</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-20 mt-24">

          {features.map((feature) => (
            <div key={feature.number}>
              <div className="text-orange-600 text-sm tracking-widest">
                {feature.number}
              </div>

              <h3 className="mt-4 font-serif text-5xl leading-none">
                {feature.title}
              </h3>

              <p className="mt-6 text-lg text-stone-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}