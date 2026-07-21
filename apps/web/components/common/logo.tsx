import Link from "next/link"

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold tracking-tight"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-950 text-sm font-bold text-white">
        S
      </div>

      <div className="flex flex-col leading-none">
        <span className="text-base font-semibold">
          StreamiX
        </span>

        <span className="text-xs text-stone-500">
          Distributed Media Processing
        </span>
      </div>
    </Link>
  )
}