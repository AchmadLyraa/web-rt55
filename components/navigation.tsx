'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';

  const publicLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/pengumuman', label: 'Pengumuman' },
    { href: '/laporan', label: 'Laporan Kas' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-primary">
            RT 55
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {status === 'loading' ? (
              <span className="hidden md:block text-sm text-muted-foreground">...</span>
            ) : session?.user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {session.user.name}
                </span>
                {isAdmin && (
                  <Link href="/admin/homepage">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ redirectTo: '/' })}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}

            <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border py-2 bg-card">
            <div className="space-y-1">
              {publicLinks.map((link) => (
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
              {status !== 'loading' && session?.user ? (
                <div className="space-y-2 px-3 py-2">
                  <p className="text-sm text-muted-foreground">
                    {session.user.name}
                  </p>
                  {isAdmin && (
                    <Link href="/admin/homepage" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      signOut({ redirectTo: '/' });
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
