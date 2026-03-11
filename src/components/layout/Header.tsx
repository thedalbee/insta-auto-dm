"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const navClass = (path: string) =>
    `text-sm transition-colors ${pathname === path ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}`;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          insta-auto-dm
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/" className={navClass("/")}>Home</Link>
          <Link href="/landing" className={navClass("/landing")}>Features</Link>
          <Link href="/dashboard" className={navClass("/dashboard")}>Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
