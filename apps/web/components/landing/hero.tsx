import Link from "next/link";

export function Hero() {
  return (
    <section className="py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-6">

        <div className="max-w-4xl">

          <span className="inline-flex px-4 py-2 rounded-full border border-stone-300 text-sm">
            Media processing infrastructure for developers.
          </span>

          <h1 className="mt-8 text-6xl lg:text-8xl font-bold tracking-tight leading-none">
            Video infrastructure
            <br />
            for modern applications.
          </h1>

          <p className="mt-8 text-xl text-stone-600 max-w-2xl leading-relaxed">
            Upload, transcode, process and deliver media at scale.
            Built with Go, Redis Streams, FFmpeg, PostgreSQL,
            S3 and Kubernetes.
          </p>

          <div className="flex gap-4 mt-10">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-lg bg-orange-500 text-white font-medium"
            >
              Start Building
            </Link>

            <a
              href="#pricing"
              className="px-6 py-3 rounded-lg border border-stone-300"
            >
              View Pricing
            </a>
          </div>
        </div>

        <div className="mt-24 border border-stone-200 rounded-3xl bg-white p-10">
          <div className="grid md:grid-cols-5 gap-4 text-center">
            <div className="p-5 rounded-xl bg-stone-50">
              Upload
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
          </div>
        </div>

      </div>
    </section>
  );
}