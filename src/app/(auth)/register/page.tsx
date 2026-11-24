'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Button, Alert, BrandLogo } from '@/components/ui';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [awaitingEmailConfirm, setAwaitingEmailConfirm] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleResendConfirmation = async () => {
    if (!awaitingEmailConfirm) return;
    setResending(true);
    setErrorMsg(null);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: awaitingEmailConfirm,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      setSuccessMsg('A fresh confirmation email has been sent. Please check your inbox.');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to resend confirmation email.');
    } finally {
      setResending(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // If Supabase returned an active session immediately, provision the Player row now
      if (data.session) {
        const meRes = await fetch('/api/player/me');
        if (!meRes.ok) {
          setErrorMsg('Account created, but failed to initialise player record. Please sign in.');
          return;
        }
        setSuccessMsg('Account created! Taking you to character & career onboarding...');
        router.push('/onboarding');
        router.refresh();
        return;
      }

      // Email confirmation required by Supabase Auth project settings
      setAwaitingEmailConfirm(email.trim());
      setSuccessMsg(
        'Registration successful! Confirm your email address from your inbox, then sign in to complete onboarding.'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during registration.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden">
      <div className="absolute top-1/3 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <Card
        variant="elevated"
        elevation="elevation-2"
        className="w-full max-w-md relative z-10 border border-outline-variant/60 backdrop-blur-md bg-surface/90 my-8"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Create Your X3M Life Account
          </h1>
          <p className="text-sm text-surface-foreground/70 mt-1 font-body">
            Step 1 of 2: Register credentials, then build your employee profile
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

        {awaitingEmailConfirm ? (
          <div className="space-y-4">
            <div className="p-4 rounded-m3-md bg-surface-container border border-outline/30 text-sm font-body text-surface-foreground/85 space-y-2">
              <p className="font-semibold text-foreground font-heading">Check your email inbox</p>
              <p>
                We sent a confirmation link to{' '}
                <span className="font-semibold text-foreground">{awaitingEmailConfirm}</span>.
                Click the link in that email to verify your account and go straight to employee
                onboarding.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <Link href="/login" className="block">
                <Button type="button" className="w-full shadow-elevation-2 py-3">
                  Go to Sign In
                </Button>
              </Link>
              <Button
                type="button"
                variant="tonal"
                disabled={resending}
                onClick={handleResendConfirmation}
                className="w-full"
              >
                {resending ? 'Resending Email...' : 'Resend Confirmation Email'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setAwaitingEmailConfirm(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-surface-foreground/60 hover:text-foreground transition-colors"
              >
                Register with a different email address
              </button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleRegister} className="space-y-4">
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
              Password
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
              Confirm Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full shadow-elevation-2 py-3">
              {loading ? 'Creating Account...' : 'Continue to Onboarding'}
            </Button>
          </div>
        </form>
        )}

        <div className="mt-6 pt-5 border-t border-outline-variant/40 text-center">
          <p className="text-sm text-surface-foreground/70 font-body">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
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
