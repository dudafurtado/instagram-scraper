import "./globals.css";

import { Toaster } from "sonner";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProvider } from "@/contexts/app-context";
import Navigation from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instagram Tool",
  description: "Instagram data collection and analysis tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Toaster />
        <AppProvider>
          <main className="min-h-screen px-4 pt-3 bg-gradient-to-tr from-[#fbad50] to-[#bc2a8d]">
            <Navigation />
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
