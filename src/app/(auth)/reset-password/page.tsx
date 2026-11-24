'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Button, Alert, BrandLogo } from '@/components/ui';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function checkRecoverySession() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (!active) return;
        setHasSession(Boolean(user));
      } catch {
        if (!active) return;
        setHasSession(false);
      } finally {
        if (active) setCheckingSession(false);
      }
    }
    checkRecoverySession();
    return () => {
      active = false;
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setSuccessMsg('Password updated! Redirecting you to X3M Life...');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1200);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to update password.');
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
            Choose a New Password
          </h1>
          <p className="text-sm text-surface-foreground/70 mt-1 font-body">
            Enter a strong new password for your X3M Life account.
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

        {checkingSession ? (
          <p className="text-sm text-center text-surface-foreground/70 py-6 font-body">
            Verifying your recovery link...
          </p>
        ) : !hasSession ? (
          <div className="space-y-4">
            <Alert variant="warning">
              Your password reset link is missing or expired. Please request a fresh recovery link.
            </Alert>
            <Link href="/forgot-password" className="block">
              <Button type="button" className="w-full py-3">
                Request New Reset Link
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full shadow-elevation-2 py-3">
                {loading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-outline-variant/40 text-center">
          <Link href="/login" className="text-sm text-primary font-semibold hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}

