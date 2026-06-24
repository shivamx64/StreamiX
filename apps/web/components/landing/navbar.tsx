import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#f7f5f2]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link
          href="/"
          className="font-serif text-4xl tracking-tight"
        >
          StreamiX
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm text-stone-600">
          <a href="#features">Features</a>
          <a href="#docs">Docs</a>
          <a href="#pipeline">Pipeline</a>
          <a href="#architecture">Architecture</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm"
          >
            Sign In
          </Link>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-sm"
          >
            Dashboard
          </Link>
        </div>

      </div>
    </header>
  );
}