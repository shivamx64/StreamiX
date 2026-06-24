import Link from "next/link";

function HeroDashboardMockup() {
  return (
    <div className="relative hidden lg:block">

      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

      {/* Floating Worker Card */}
      <div className="absolute -bottom-8 -left-8 z-20 bg-stone-950 text-white rounded-3xl p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-400">
          Worker Status
        </p>

        <p className="mt-3 text-4xl font-serif">
          12 / 12
        </p>

        <p className="mt-1 text-sm text-stone-400">
          Healthy
        </p>
      </div>

      {/* Main Dashboard */}
      <div className="relative bg-white border border-stone-200 rounded-[32px] shadow-xl overflow-hidden">

        <div className="border-b border-stone-200 p-4 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-300" />
          <div className="h-3 w-3 rounded-full bg-yellow-300" />
          <div className="h-3 w-3 rounded-full bg-green-300" />
        </div>

        <div className="p-8">

          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Processing Overview
            </h3>

            <span className="text-sm text-green-600">
              Live
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">

            <div className="rounded-2xl bg-stone-50 p-5">
              <p className="text-sm text-stone-500">
                Active Jobs
              </p>

              <p className="mt-3 font-serif text-4xl">
                127
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-5">
              <p className="text-sm text-stone-500">
                Workers
              </p>

              <p className="mt-3 font-serif text-4xl">
                12
              </p>
            </div>

            <div className="rounded-2xl bg-stone-50 p-5">
              <p className="text-sm text-stone-500">
                Queue
              </p>

              <p className="mt-3 font-serif text-4xl">
                41
              </p>
            </div>

          </div>

          <div className="mt-10">

            <h4 className="text-sm text-stone-500 mb-4">
              Processing Jobs
            </h4>

            <div className="space-y-4">

              {[
                {
                  file: "movie-trailer.mp4",
                  status: "Processing",
                  progress: 72,
                },
                {
                  file: "launch-demo.mov",
                  status: "Queued",
                  progress: 22,
                },
                {
                  file: "product-intro.mp4",
                  status: "Processing",
                  progress: 94,
                },
              ].map((job) => (
                <div
                  key={job.file}
                  className="border border-stone-200 rounded-2xl p-4"
                >
                  <div className="flex justify-between text-sm">
                    <span>{job.file}</span>

                    <span className="text-orange-600">
                      {job.status}
                    </span>
                  </div>

                  <div className="mt-3 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-600 rounded-full"
                      style={{
                        width: `${job.progress}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="py-28 lg:py-40">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-24 items-center">

          {/* Left Side */}

          <div>

            <div className="uppercase tracking-[0.3em] text-xs text-stone-500">
              Distributed Media Platform · Go · FFmpeg · Kubernetes
            </div>

            <h1 className="mt-10 leading-[0.88]">
              <span className="block font-serif text-[5rem] lg:text-[8rem]">
                Process
              </span>

              <span className="block font-serif italic text-[5rem] lg:text-[8rem] text-orange-700">
                video
              </span>

              <span className="block font-serif text-[5rem] lg:text-[8rem]">
                at scale.
              </span>
            </h1>

            <p className="mt-10 max-w-xl text-xl leading-relaxed text-stone-600">
              StreamiX explores the systems behind modern media
              platforms. Upload, queue, transcode, distribute
              and stream video through a distributed cloud-native
              infrastructure.
            </p>

            <div className="flex flex-wrap gap-4 mt-12">

              <Link
                href="/dashboard"
                className="px-8 py-4 rounded-full bg-stone-900 text-white"
              >
                Open Dashboard
              </Link>

              <a
                href="#features"
                className="px-8 py-4 rounded-full border border-stone-300"
              >
                Explore Features
              </a>

            </div>

          </div>

          {/* Right Side */}

          <HeroDashboardMockup />

        </div>

      </div>
    </section>
  );
}