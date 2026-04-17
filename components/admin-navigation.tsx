"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNavigation() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const adminLinks = [
    { href: "/admin/homepage", label: "Kelola Beranda" },
    { href: "/admin/galeri", label: "Kelola Galeri" },
    { href: "/admin/pengumuman", label: "Kelola Pengumuman" },
    { href: "/admin/laporan", label: "Kelola Laporan" },
    { href: "/admin/warga", label: "Data Warga" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-primary">
            Admin RT 55
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth & Mobile Menu */}
          <div className="flex items-center gap-2">
            {status !== "loading" && session?.user && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {session.user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ redirectTo: "/" })}
                >
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-2 bg-card">
            <div className="space-y-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 border-t border-border"></div>

              {status !== "loading" && session?.user && (
                <div className="space-y-2 px-3 py-2">
                  <p className="text-sm text-muted-foreground">
                    {session.user.name}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      signOut({ redirectTo: "/" });
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
