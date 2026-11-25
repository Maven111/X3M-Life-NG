'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Button, Alert, BrandLogo } from '@/components/ui';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sentToEmail, setSentToEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const trimmedEmail = email.trim();
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setSentToEmail(trimmedEmail);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send password reset email.');
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
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Reset Your Password
          </h1>
          <p className="text-sm text-surface-foreground/70 mt-1 font-body">
            Enter your account email and we&apos;ll send you a secure recovery link.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5">
            <Alert variant="error" onClose={() => setErrorMsg(null)}>
              {errorMsg}
            </Alert>
          </div>
        )}

        {sentToEmail ? (
          <div className="space-y-5">
            <Alert variant="success">
              If an account exists for <span className="font-semibold">{sentToEmail}</span>, a
              password reset link has been sent. Please check your inbox and spam folder.
            </Alert>
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="tonal"
                onClick={() => setSentToEmail(null)}
                className="w-full"
              >
                Use a Different Email
              </Button>
              <Link
                href="/auth?mode=login"
                className="text-center text-sm text-primary font-semibold hover:underline"
              >
                Return to Clock In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full shadow-elevation-2 py-3">
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-outline-variant/40 text-center">
          <p className="text-sm text-surface-foreground/70 font-body">
            Remembered your password?{' '}
            <Link href="/auth?mode=login" className="text-primary font-semibold hover:underline">
              Clock in
            </Link>
          </p>
          <div className="mt-3">
            <Link
              href="/"
              className="text-xs text-surface-foreground/50 hover:text-foreground transition-colors"
            >
              ← Back to Agency Home
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
