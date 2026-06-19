import Link from "next/link";

export function CTA() {
  return (
    <section className="py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-6xl font-bold tracking-tight">
          Learn distributed systems
          <br />
          by building real infrastructure.
        </h2>

        <p className="mt-6 text-lg text-stone-600">
          StreamiX combines backend engineering,
          distributed systems and cloud-native infrastructure
          into a single project.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex mt-10 px-8 py-4 rounded-lg bg-orange-500 text-white font-medium"
        >
          Open Dashboard
        </Link>

      </div>
    </section>
  );
}