import Link from "next/link";

export function Hero() {
  return (
    <section className="relative py-40 lg:py-30">
      <div className="max-w-7xl mx-auto px-6">

        <div className="max-w-5xl">

          <div className="uppercase tracking-[0.3em] text-xs text-stone-500">
            Distributed Media Platform · Go · FFmpeg · Kubernetes
          </div>

          <h1 className="mt-8 leading-[0.9]">
            <span className="block text-[5rem] lg:text-[9rem] font-serif font-medium text-stone-900">
              Process
            </span>

            <span className="block text-[5rem] lg:text-[9rem] font-serif italic text-orange-600">
              video
            </span>

            <span className="block text-[5rem] lg:text-[9rem] font-serif font-medium text-stone-900">
              at scale.
            </span>
          </h1>

          <p className="mt-10 max-w-2xl text-xl text-stone-600 leading-relaxed">
            StreamiX explores the systems behind modern media
            platforms. Upload, queue, transcode, distribute and
            stream video through a distributed cloud-native pipeline.
          </p>

          <div className="flex gap-4 mt-12">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-stone-900 text-white rounded-full"
            >
              Open Dashboard
            </Link>

            <Link
              href="#architecture"
              className="px-8 py-4 border rounded-full"
            >
              Architecture
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}