"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Users, CheckCircle, LogOut } from "lucide-react";
import { useApp } from "@/contexts/app-context";

export default function Navigation() {
  const pathname = usePathname();
  const { credentials, setCredentials, setCollectionData, setCurrentUserId } =
    useApp();

  const handleLogout = () => {
    setCredentials(null);
    setCollectionData({ followers: [], following: [] });
    setCurrentUserId("");
  };

  const navItems = [
    { href: "/", icon: Search, label: "Collect" },
    { href: "/verify", icon: CheckCircle, label: "Verify" },
    { href: "/compare", icon: Users, label: "Compare" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-[#E1306C]">Instagram Tool</h1>
            <div className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-[#E1306C]"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="hidden sm:block">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          {credentials && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden sm:block">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
