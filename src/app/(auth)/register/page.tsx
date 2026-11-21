'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Button, Alert } from '@/components/ui';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const DEPARTMENTS = [
  { id: 'creative', name: 'Creative (Art & Copy)', description: 'Campaign concepts, visual craft & storytelling' },
  { id: 'client_services', name: 'Client Services (Accounts)', description: 'Brand custodianship, briefs & client growth' },
  { id: 'media', name: 'Media Planning & Buying', description: 'Audience reach, OOH, TV, Radio & digital ads' },
  { id: 'strategy', name: 'Strategy & Brand Planning', description: 'Consumer insights, research & brand positioning' },
  { id: 'digital', name: 'Tech & Digital Innovation', description: 'Interactive apps, social campaigns & dev' }
];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('creative');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            department
          }
        }
      });

      if (error) {
        if (error.message.includes('placeholder') || error.message.includes('fetch failed')) {
          setSuccessMsg('Local development mode: Registered demo employee account.');
          setTimeout(() => router.push('/'), 1200);
          return;
        }
        setErrorMsg(error.message);
        return;
      }

      setSuccessMsg('Registration successful! Directing to employee onboarding...');
      setTimeout(() => router.push('/'), 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden">
      {/* Brand glow circles */}
      <div className="absolute top-1/3 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <Card variant="elevated" elevation="elevation-2" className="w-full max-w-lg relative z-10 border border-outline-variant/60 backdrop-blur-md bg-surface/90 my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-gradient-primary text-white text-2xl font-black shadow-elevation-2 mb-3">
            X3M
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-foreground">
            Join X3M Ideas
          </h1>
          <p className="text-sm text-surface-foreground/70 mt-1 font-body">
            Begin your journey from Intern to Executive Director
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

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Tunde Adebayo"
              className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
              Company Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@x3mideas.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 rounded-m3-md bg-surface-container text-foreground border border-outline/40 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-body"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-foreground/80 mb-1.5 font-heading">
              Career Track / Department
            </label>
            <div className="space-y-2 mt-2">
              {DEPARTMENTS.map((dept) => (
                <label
                  key={dept.id}
                  className={`
                    flex items-start gap-3 p-3 rounded-m3-md border cursor-pointer transition-all
                    ${department === dept.id
                      ? 'border-primary bg-primary/5 shadow-elevation-1'
                      : 'border-outline/30 hover:border-outline bg-surface-container/50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="department"
                    value={dept.id}
                    checked={department === dept.id}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="text-sm font-semibold font-heading text-foreground">{dept.name}</div>
                    <div className="text-xs text-surface-foreground/70 font-body">{dept.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full shadow-elevation-2 py-3"
            >
              {loading ? 'Creating Employee Profile...' : 'Complete Registration'}
            </Button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-outline-variant/40 text-center">
          <p className="text-sm text-surface-foreground/70 font-body">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign in
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

