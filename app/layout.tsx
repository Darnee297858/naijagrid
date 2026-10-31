import type { Metadata } from "next";
import React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NaijaGrid - Know When Light Dey",
  description: "Crowd-sourced NEPA grid tracking and verified Nigerian artisan directory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
        <header className="bg-emerald-800 text-white py-6 px-4 shadow-md">
          <div className="max-w-xl mx-auto flex items-center justify-center gap-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h1 className="text-2xl font-bold">NaijaGrid 🇳🇬</h1>
              <p className="text-sm opacity-90">Know When Light Dey. Find Trusted Artisans.</p>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-4xl w-full mx-auto p-4">
          {children}
        </main>
        <footer className="text-center py-6 text-xs text-gray-500">
          &copy; {new Date().getFullYear()} NaijaGrid. Built for Nigerians.
        </footer>
      </body>
    </html>
  );
}