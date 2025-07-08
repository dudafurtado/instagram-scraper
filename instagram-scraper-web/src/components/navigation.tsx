"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Users, CheckCircle, LockKeyhole } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/auth", icon: LockKeyhole, label: "Auth" },
    { href: "/collect", icon: Search, label: "Collect" },
    { href: "/connections", icon: Users, label: "Connections" },
  ];

  return (
    <nav className="max-w-5xl mx-auto rounded-xl bg-white/15 backdrop-blur-xl sticky top-0 z-1 py-2.5 px-5 flex items-center justify-between">
      <h1 className="text-xl font-bold text-white">Instagram Tool</h1>
      <section className="flex space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-colors ${
                isActive
                  ? "bg-blue-50 text-[#E1306C]"
                  : "text-white hover:text-[#833AB4] hover:bg-gray-50/60"
              }`}
            >
              <Icon size={20} />
              <span className="hidden sm:block">{item.label}</span>
            </Link>
          );
        })}
      </section>
    </nav>
  );
}
