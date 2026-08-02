import Link from "next/link";

export function NavigationActions() {
	return (
		<div className="hidden items-center gap-3 md:flex">
			<Link
				href="/login"
				className="text-sm text-neutral-600 hover:text-black"
			>
				Log in
			</Link>

			<Link
				href="/signup"
				className="rounded-full bg-black px-5 py-2 text-sm text-white transition hover:bg-neutral-800"
			>
				Start Free
			</Link>
		</div>
	);
}