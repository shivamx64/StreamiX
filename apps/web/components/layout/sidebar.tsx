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
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Videos",
    href: "/videos",
    icon: Video,
  },
  {
    label: "Uploads",
    href: "/uploads",
    icon: Upload,
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
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white">
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-semibold">
          StreamiX
        </h1>
      </div>

      <nav className="p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                active
                  ? "bg-orange-100 text-orange-700"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}