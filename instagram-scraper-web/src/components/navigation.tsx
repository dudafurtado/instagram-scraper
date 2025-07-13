"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Users, Menu, X, LockKeyholeOpen } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/auth", icon: LockKeyholeOpen, label: "Auth" },
    { href: "/collect", icon: Search, label: "Collect" },
    { href: "/connections", icon: Users, label: "Connections" },
  ];

  return (
    <nav className="max-w-5xl mx-auto rounded-xl bg-white/15 backdrop-blur-xl sticky top-0 z-50 py-3 px-5 flex items-center justify-between">
      <h1 className="text-xl font-bold text-white">Instagram Tool</h1>

      {/* Desktop links */}
      <section className="hidden md:flex space-x-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-colors ${
                isActive
                  ? "bg-blue-50 text-[#dc6c6f]"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </section>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white focus:outline-none py-1.5"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="absolute top-18 right-1 w-48 bg-white backdrop-blur-xl rounded-xl p-4 flex flex-col space-y-2 md:hidden z-50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#fbad50] text-white"
                    : "text-[#dc6c6f] hover:bg-[#fbad50]/20"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
