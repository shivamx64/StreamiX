import Link from "next/link";

export function CTA() {
  return (
    <section className="py-40 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="font-serif text-6xl lg:text-9xl leading-[0.9]">
          The best way
          <br />
          to learn
          <span className="italic text-orange-700">
            {" "}distributed systems
          </span>
          <br />
          is to build one.
        </h2>

        <p className="mt-10 max-w-2xl text-xl text-stone-600">
          StreamiX combines distributed systems, cloud-native
          infrastructure, media processing and backend engineering
          into a single production-grade project.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex mt-12 px-8 py-4 rounded-full bg-stone-900 text-white"
        >
          Open Dashboard
        </Link>

      </div>
    </section>
  );
}