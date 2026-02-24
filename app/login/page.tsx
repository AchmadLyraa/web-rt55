'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('[v0] Login attempt with email:', email);
      const result = await signInAction({ email, password });

      if (result.success) {
        console.log('[v0] Login successful, redirecting to admin');
        router.push('/admin/homepage');
      } else {
        setError(result.error || 'Terjadi kesalahan');
        console.log('[v0] Login failed:', result.error);
      }
    } catch (err) {
      console.error('[v0] Login error:', err);
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="admin@rt.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Demo Credentials:<br />
              Email: admin@rt.local<br />
              Password: admin123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
