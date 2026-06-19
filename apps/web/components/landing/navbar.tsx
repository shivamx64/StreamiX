import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#f8f7f4]/80 border-b border-stone-200">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-lg tracking-tight"
        >
          StreamiX
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-stone-600">
          <a href="#features">Features</a>
          <a href="#pipeline">Docs</a>
          <a href="#architecture">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-stone-700"
          >
            Sign In
          </Link>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}