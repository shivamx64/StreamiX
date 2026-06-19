const steps = [
  "Upload",
  "Job Created",
  "Queued",
  "Worker Assigned",
  "Transcoding",
  "Stored",
  "Ready",
];

export function Pipeline() {
  return (
    <section
      id="pipeline"
      className="py-32"
    >
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold tracking-tight">
          Processing Pipeline
        </h2>

        <div className="mt-16 flex flex-wrap gap-4">

          {steps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3 border border-stone-200 rounded-full px-5 py-3 bg-white"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>

              <span>{step}</span>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}