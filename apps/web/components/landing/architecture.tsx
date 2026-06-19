export function Architecture() {
  return (
    <section
      id="architecture"
      className="py-32 border-y border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold tracking-tight">
          Architecture
        </h2>

        <p className="mt-4 text-lg text-stone-600">
          Built around event-driven processing.
        </p>

        <div className="mt-16 bg-white border border-stone-200 rounded-3xl p-12">

          <div className="grid md:grid-cols-7 gap-4 text-center">

            <div className="p-5 rounded-xl bg-stone-50">
              Client
            </div>

            <div className="p-5 rounded-xl bg-stone-50">
              API
            </div>

            <div className="p-5 rounded-xl bg-stone-50">
              Redis
            </div>

            <div className="p-5 rounded-xl bg-stone-50">
              Workers
            </div>

            <div className="p-5 rounded-xl bg-stone-50">
              FFmpeg
            </div>

            <div className="p-5 rounded-xl bg-stone-50">
              S3
            </div>

            <div className="p-5 rounded-xl bg-stone-50">
              CDN
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}