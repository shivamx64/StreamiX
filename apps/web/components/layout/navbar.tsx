import {
  Bell,
  Search,
} from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-stone-200 bg-[#f8f7f4]/90 backdrop-blur">

      <div className="h-full px-8 flex items-center justify-between">

        <div className="relative w-[320px]">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            placeholder="Search videos, jobs..."
            className="
              w-full
              h-10
              pl-10
              pr-4
              rounded-xl
              border
              border-stone-200
              bg-white
              text-sm
              outline-none
              focus:ring-2
              focus:ring-orange-200
            "
          />
        </div>

        <div className="flex items-center gap-4">

          <button
            className="
              h-10
              w-10
              rounded-xl
              border
              border-stone-200
              bg-white
              flex
              items-center
              justify-center
              hover:bg-stone-50
            "
          >
            <Bell size={18} />
          </button>

          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
            S
          </div>

        </div>

      </div>

    </header>
  );
}