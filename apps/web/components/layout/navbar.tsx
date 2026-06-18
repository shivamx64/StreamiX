import { Search } from "lucide-react";

export function Navbar() {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-3 text-neutral-400"
        />

        <input
          placeholder="Search..."
          className="pl-9 pr-4 py-2 rounded-lg border bg-neutral-50"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center">
          S
        </div>
      </div>
    </header>
  );
}