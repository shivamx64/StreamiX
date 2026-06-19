"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Video,
  Upload,
  Activity,
  Cpu,
  Settings,
  PlayCircle,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Uploads",
    href: "/uploads",
    icon: Upload,
  },
  {
    label: "Videos",
    href: "/videos",
    icon: Video,
  },
  {
    label: "Jobs",
    href: "/jobs",
    icon: Activity,
  },
  {
    label: "Workers",
    href: "/workers",
    icon: Cpu,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-stone-200 bg-[#f8f7f4] flex flex-col">

      <div className="h-16 border-b border-stone-200 px-6 flex items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <PlayCircle
              size={18}
              className="text-white"
            />
          </div>

          <span className="font-semibold text-lg tracking-tight">
            StreamiX
          </span>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">

        <p className="text-xs uppercase tracking-wider text-stone-400 mb-3 px-3">
          Platform
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm transition-all ${
                active
                  ? "bg-orange-100 text-orange-700"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-stone-200 p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium">
            S
          </div>

          <div>
            <p className="text-sm font-medium">
              Shivam
            </p>

            <p className="text-xs text-stone-500">
              Free Plan
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}