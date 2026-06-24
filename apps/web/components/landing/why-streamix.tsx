const items = [
  {
    title: "Upload",
    desc: "Store original media directly in object storage."
  },
  {
    title: "Process",
    desc: "Scale transcoding workers independently."
  },
  {
    title: "Deliver",
    desc: "Generate adaptive streams for every device."
  }
];

export function WhyStreamix() {
  return (
    <section className="py-40 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="font-serif text-7xl">
          Why StreamiX?
        </h2>

        <div className="grid lg:grid-cols-3 gap-12 mt-20">

          {items.map((item) => (
            <div key={item.title}>
              <h3 className="font-serif text-5xl">
                {item.title}
              </h3>

              <p className="mt-6 text-stone-600 text-lg">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}