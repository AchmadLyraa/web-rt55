"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Image,
  Megaphone,
  BookOpen,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";

const adminLinks = [
  { href: "/admin/homepage", label: "Beranda", icon: LayoutDashboard },
  { href: "/admin/galeri", label: "Galeri", icon: Image },
  { href: "/admin/pengumuman", label: "Pengumuman", icon: Megaphone },
  { href: "/admin/laporan", label: "Laporan", icon: BookOpen },
  { href: "/admin/warga", label: "Data Warga", icon: Users },
];

export default function AdminNavigation() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-bold text-gray-900 tracking-tight"
            >
              RT 55 <span className="text-gray-400 font-normal">Admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {adminLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status !== "loading" && session?.user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut({ redirectTo: "/" })}
                  className="flex items-center gap-1 px-2 py-1.5 rounded text-xs text-gray-500 hover:text-red-500 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
            <button
              className="md:hidden p-1.5 text-gray-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            {adminLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    active
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-gray-200 mt-2 pt-2 px-3">
              {session?.user && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => {
                      signOut({ redirectTo: "/" });
                      setIsOpen(false);
                    }}
                    className="text-xs text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
