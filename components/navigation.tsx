"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  const publicLinks = [
    { href: "/", label: "Beranda" },
    { href: "/galeri", label: "Galeri" },
    { href: "/pengumuman", label: "Pengumuman" },
    { href: "/laporan", label: "Laporan Kas" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[9999]">
        <div className="mx-auto max-w-7xl px-4 mt-3">
          <div
            className="
              flex items-center justify-between h-16 px-4
              rounded-2xl
              bg-white/10
              backdrop-blur-xl
              border border-white/10
              shadow-[0_8px_32px_rgba(0,0,0,0.25)]
            "
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                {/* LOGO */}
                <Link
                  href="/"
                  className="font-bold text-xl bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
                >
                  RT 55
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-1 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                  {publicLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 rounded-full text-sm font-medium text-white [text-shadow:0_2px_8px_rgba(0,0,0,1)] transition-all hover:bg-white/10 hover:scale-105"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-2">
                  {status === "loading" ? (
                    <span className="hidden md:block text-sm text-muted-foreground animate-pulse">
                      loading...
                    </span>
                  ) : session?.user ? (
                    <div className="hidden md:flex items-center gap-2">
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-gray text-sm">
                        {session.user.name}
                      </div>

                      {isAdmin && (
                        <Link href="/admin/homepage">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white text-black border-gray-400 hover:bg-white/90"
                          >
                            Dashboard
                          </Button>
                        </Link>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-black border-gray-400 hover:bg-red-50 hover:border-red-400 hover:text-red-500"
                        onClick={() => signOut({ redirectTo: "/" })}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login" className="hidden md:block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white text-black border-gray hover:bg-white/90"
                      >
                        Login
                      </Button>
                    </Link>
                  )}

                  {/* MOBILE BUTTON */}
                  <button
                    className="md:hidden p-2 rounded-md hover:bg-white/10 transition"
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
            </div>
          </div>
        </div>
      </nav>
      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden fixed top-[80px] left-0 right-0 z-[9998] px-4">
          <div
            className="
              rounded-2xl
              bg-black/40
              backdrop-blur-2xl
              [-webkit-backdrop-filter:blur(24px)]
              border border-white/10
              shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              p-3 space-y-2
              animate-in fade-in slide-in-from-top-2
            "
          >
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-white [text-shadow:0_2px_8px_rgba(0,0,0,1)] hover:bg-white/10 transition"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-white/10 my-2" />

            {status !== "loading" && session?.user ? (
              <div className="space-y-2">
                <p className="text-sm px-2 text-white [text-shadow:0_2px_8px_rgba(0,0,0,1),0_1px_3px_rgba(0,0,0,1)]">
                  {session.user.name}
                </p>

                {isAdmin && (
                  <Link href="/admin/homepage" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" variant="outline">
                      Dashboard
                    </Button>
                  </Link>
                )}

                <Button
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => {
                    signOut({ redirectTo: "/" });
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full" variant="outline">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
