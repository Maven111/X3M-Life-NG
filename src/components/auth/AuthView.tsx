'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Card, Button, Alert, BrandLogo } from '@/components/ui';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export type AuthMode = 'register' | 'login';

interface AuthViewProps {
  initialMode?: AuthMode;
  initialError?: string | null;
}

const USERNAME_CLIENT_PATTERN = /^[a-z0-9_]{3,30}$/;

function sanitizeUsernameInput(raw: string): string {
  return raw.trim().replace(/^@+/, '').toLowerCase();
}

export function AuthView({ initialMode = 'register', initialError = null }: AuthViewProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Registration & Clock-in form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [awaitingEmailConfirm, setAwaitingEmailConfirm] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(initialError);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setShowPassword(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setAwaitingEmailConfirm(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', nextMode);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid username/email or password.');
        return;
      }

      if (data.needsOnboarding) {
        setSuccessMsg('Clocked in! Redirecting to employee onboarding...');
        router.push('/onboarding');
      } else {
        setSuccessMsg('Welcome back! Opening your employee dashboard...');
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = fullName.trim();
    const normalizedUsername = sanitizeUsernameInput(username);

    if (trimmedName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!USERNAME_CLIENT_PATTERN.test(normalizedUsername)) {
      setErrorMsg('Username must be 3–30 characters using only letters, numbers, and underscores.');
      return;
    }

    setLoading(true);
    try {
      // 1. Server-authoritative username availability check before creating auth account
      const checkRes = await fetch(
        `/api/auth/check-username?username=${encodeURIComponent(normalizedUsername)}`
      );
      const checkData = await checkRes.json();
      if (!checkRes.ok || !checkData.available) {
        setErrorMsg(checkData.reason || 'That username is not available. Please choose another.');
        return;
      }

      // 2. Register with Supabase Auth, storing Name + Username in user metadata
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: trimmedName,
            username: normalizedUsername
          }
        }
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // 3. If Supabase returned an active session immediately, persist Player row right away
      if (data.session) {
        const meRes = await fetch('/api/player/me');
        if (!meRes.ok) {
          setErrorMsg('Account created, but failed to initialise player record. Please clock in.');
          return;
        }
        setSuccessMsg('Account created! Taking you to character & career onboarding...');
        router.push('/onboarding');
        router.refresh();
        return;
      }

      // 4. Email confirmation required by Supabase Auth settings
      setAwaitingEmailConfirm(email.trim());
      setSuccessMsg(
        'Registration successful! Confirm your email address from your inbox, then clock in to complete onboarding.'
      );
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : 'An unexpected error occurred during registration.'
      );
    } finally {
      setLoading(false);
    }
  };

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

  const isRegister = mode === 'register';

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden">
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <Card
        variant="elevated"
        elevation="elevation-2"
        className="w-full max-w-md relative z-10 border border-outline-variant/60 backdrop-blur-md bg-surface/95 my-8"
      >
        {/* Brand Logo + Segmented Auth Mode Switcher (Registration First, Clock In Second) */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <BrandLogo size="lg" />
          </div>

          <div
            role="tablist"
            aria-label="Authentication mode"
            className="grid grid-cols-2 p-1 rounded-m3-full bg-surface-container border border-outline-variant/50 mb-5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={isRegister}
              onClick={() => switchMode('register')}
              className={`py-2 px-3 rounded-m3-full text-xs font-semibold font-heading transition-all cursor-pointer ${
                isRegister
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'text-surface-foreground/70 hover:text-foreground'
              }`}
            >
              Start Onboarding
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isRegister}
              onClick={() => switchMode('login')}
              className={`py-2 px-3 rounded-m3-full text-xs font-semibold font-heading transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'text-surface-foreground/70 hover:text-foreground'
              }`}
            >
              Clock In
            </button>
          </div>

          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            {isRegister ? 'Start your onboarding.' : 'Welcome back!'}
          </h1>
          <p className="text-sm text-surface-foreground/70 mt-1 font-body">
            {isRegister
              ? 'Create your X3M Ideas employee credentials'
              : "Nigeria's Elite Agency Life Simulation"}
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

        {/* Email Confirmation State (Post-Registration) */}
        {isRegister && awaitingEmailConfirm ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 pt-1">
              <Button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full shadow-elevation-2 py-3"
              >
                Go to Clock In
              </Button>
              <Button
                type="button"
                variant="tonal"
                disabled={resending}
                onClick={handleResendConfirmation}
                className="w-full py-3"
              >
                {resending ? 'Resending Email...' : 'Resend Confirmation Email'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setAwaitingEmailConfirm(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-surface-foreground/60 hover:text-foreground transition-colors cursor-pointer"
              >
                Register with a different email address
              </button>
            </div>
          </div>
        ) : isRegister ? (
          /* REGISTRATION FORM (First Tab: Name, Username, Email, Password — No Confirm Password) */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                Name
              </label>
              <input
                type="text"
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Chidinma Okafor"
                className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                Username
              </label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={30}
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. chidinma_x3m"
                className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
              />
              <p className="text-[11px] text-surface-foreground/55 mt-1 font-body">
                3–30 characters: lowercase letters, numbers, and underscores.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                Email
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 pr-11 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full shadow-elevation-2 py-3">
                {loading ? 'Creating Account...' : 'Continue to Onboarding'}
              </Button>
            </div>
          </form>
        ) : (
          /* CLOCK IN FORM (Second Tab: Username or Email + Password with Eye Toggle) */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
                Username or Email
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="username or you@example.com"
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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 pr-11 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full shadow-elevation-2 py-3">
                {loading ? 'Clocking in...' : 'Clock in'}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-outline-variant/40 text-center">
          <p className="text-sm text-surface-foreground/70 font-body">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                >
                  Clock in
                </button>
              </>
            ) : (
              <>
                New to X3M Life?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                >
                  Start your onboarding.
                </button>
              </>
            )}
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
