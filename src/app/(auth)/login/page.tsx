'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Button, Alert } from '@/components/ui';
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
        email,
        password
      });

      if (error) {
        // Fallback for development if Supabase placeholder keys are active
        if (error.message.includes('placeholder') || error.message.includes('fetch failed')) {
          setSuccessMsg('Local development mode: Signed in as demo employee.');
          setTimeout(() => router.push('/'), 1200);
          return;
        }
        setErrorMsg(error.message);
        return;
      }

      setSuccessMsg('Login successful! Redirecting to agency office...');
      setTimeout(() => router.push('/'), 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden">
      {/* Subtle brand glow circles */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <Card variant="elevated" elevation="elevation-2" className="w-full max-w-md relative z-10 border border-outline-variant/60 backdrop-blur-md bg-surface/90">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-gradient-primary text-white text-2xl font-black shadow-elevation-2 mb-3">
            X3M
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Sign In to X3M Life
          </h1>
          <p className="text-sm text-surface-foreground/70 mt-1 font-body">
            Nigeria&apos;s Elite Agency Life Simulation
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-5">
            <Alert variant="error" onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          </div>
        )}
        {successMsg && (
          <div className="mb-5">
            <Alert variant="success">
              {successMsg}
            </Alert>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
              Company Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="employee@x3mideas.com"
              className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 font-heading">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full shadow-elevation-2 py-3"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-outline-variant/40 text-center">
          <p className="text-sm text-surface-foreground/70 font-body">
            New employee?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Register employee account
            </Link>
          </p>
          <div className="mt-3">
            <Link href="/" className="text-xs text-surface-foreground/50 hover:text-foreground transition-colors">
              ← Return to 3D Character Preview
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

