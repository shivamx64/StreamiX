import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-40">
      <div className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-4 gap-16">

          {/* Brand */}

          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-serif text-5xl leading-none"
            >
              StreamiX
            </Link>

            <p className="mt-6 text-stone-600 leading-relaxed max-w-xs">
              Distributed video processing infrastructure built to
              explore the engineering behind modern media platforms.
            </p>
          </div>

          {/* Product */}

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-stone-500">
              Product
            </p>

            <div className="mt-6 flex flex-col gap-4 text-stone-700">
              <a href="#features">Features</a>
              <a href="#pipeline">Pipeline</a>
              <a href="#architecture">Architecture</a>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </div>

          {/* Resources */}

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-stone-500">
              Resources
            </p>

            <div className="mt-6 flex flex-col gap-4 text-stone-700">
              <Link href="/docs">Documentation</Link>
              <Link href="/blog">Engineering Blog</Link>
              <Link href="/changelog">Changelog</Link>
              <Link href="/roadmap">Roadmap</Link>
            </div>
          </div>

          {/* Stack */}

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-stone-500">
              Infrastructure
            </p>

            <div className="mt-6 flex flex-col gap-4 text-stone-700">
              <span>Go</span>
              <span>Redis Streams</span>
              <span>FFmpeg</span>
              <span>PostgreSQL</span>
              <span>Kubernetes</span>
            </div>
          </div>

        </div>

        {/* Large Quote */}

        <div className="mt-32 pt-20 border-t border-stone-200">

          <h3 className="font-serif text-5xl lg:text-7xl leading-[0.95] max-w-5xl">
            Video infrastructure is not
            <span className="italic text-orange-700">
              {" "}video uploads.
            </span>
            <br />
            It&apos;s distributed systems,
            storage, scheduling,
            and compute.
          </h3>

        </div>

        {/* Bottom */}

        <div className="mt-24 pt-8 border-t border-stone-200 flex flex-col lg:flex-row justify-between gap-6 text-sm text-stone-500">

          <div>
            © 2026 StreamiX · Built as a distributed media platform.
          </div>

          <div className="flex flex-wrap gap-6">
            <span>Go</span>
            <span>Redis Streams</span>
            <span>FFmpeg</span>
            <span>S3</span>
            <span>Kubernetes</span>
          </div>

        </div>

      </div>
    </footer>
  );
}