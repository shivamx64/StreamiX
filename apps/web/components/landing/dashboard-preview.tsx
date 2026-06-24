export function DashboardPreview() {
  return (
    <section className="py-40">
      <div className="max-w-7xl mx-auto px-6">

        <div className="max-w-4xl">

          <span className="text-sm tracking-widest text-stone-500">
            PRODUCT
          </span>

          <h2 className="mt-6 font-serif text-7xl leading-none">
            Observe every
            <span className="italic text-orange-700">
              {" "}job.
            </span>
          </h2>

          <p className="mt-8 text-xl text-stone-600">
            Track uploads, worker activity, queue depth and
            transcoding progress in real time.
          </p>

        </div>

        <div className="mt-20 rounded-[40px] border border-stone-200 bg-white shadow-sm overflow-hidden">

          <div className="border-b border-stone-200 p-5 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-300" />
            <div className="w-3 h-3 rounded-full bg-yellow-300" />
            <div className="w-3 h-3 rounded-full bg-green-300" />
          </div>

          <div className="p-10">

            <div className="grid md:grid-cols-3 gap-6">

              <div className="border rounded-2xl p-6">
                <div className="text-sm text-stone-500">
                  Active Jobs
                </div>

                <div className="mt-2 text-5xl font-serif">
                  27
                </div>
              </div>

              <div className="border rounded-2xl p-6">
                <div className="text-sm text-stone-500">
                  Workers
                </div>

                <div className="mt-2 text-5xl font-serif">
                  12
                </div>
              </div>

              <div className="border rounded-2xl p-6">
                <div className="text-sm text-stone-500">
                  Queue Depth
                </div>

                <div className="mt-2 text-5xl font-serif">
                  93
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}