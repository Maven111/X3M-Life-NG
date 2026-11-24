'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Button, Alert, BrandLogo } from '@/components/ui';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // Sync Player record and check onboarding status via server-authoritative API
      const meRes = await fetch('/api/player/me');
      if (!meRes.ok) {
        setErrorMsg('Signed in, but could not verify your player profile. Please try again.');
        return;
      }
      const meData = await meRes.json();

      if (meData.needsOnboarding) {
        setSuccessMsg('Signed in! Redirecting to employee onboarding...');
        router.push('/onboarding');
      } else {
        setSuccessMsg('Login successful! Opening your employee dashboard...');
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <Card
        variant="elevated"
        elevation="elevation-2"
        className="w-full max-w-md relative z-10 border border-outline-variant/60 backdrop-blur-md bg-surface/90"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Sign In to X3M Life
          </h1>
          <p className="text-sm text-surface-foreground/70 mt-1 font-body">
            Nigeria&apos;s Elite Agency Life Simulation
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5">
            <Alert variant="error" onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          </div>
        )}
        {successMsg && (
          <div className="mb-5">
            <Alert variant="success">{successMsg}</Alert>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
              Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 font-heading">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline font-body"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full shadow-elevation-2 py-3">
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-outline-variant/40 text-center">
          <p className="text-sm text-surface-foreground/70 font-body">
            New to X3M Life?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
          <div className="mt-3">
            <Link href="/" className="text-xs text-surface-foreground/50 hover:text-foreground transition-colors">
              ← Back to Agency Home
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
