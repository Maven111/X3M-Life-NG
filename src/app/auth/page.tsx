import React from 'react';
import { AuthView, type AuthMode } from '@/components/auth/AuthView';

export const dynamic = 'force-dynamic';

interface AuthPageProps {
  searchParams?: {
    mode?: string;
    error?: string;
  };
}

export default function AuthPage({ searchParams }: AuthPageProps) {
  const initialMode: AuthMode = searchParams?.mode === 'login' ? 'login' : 'register';
  const initialError =
    searchParams?.error === 'auth_callback_failed'
      ? 'We could not verify your authentication link. Please clock in or request a new link.'
      : null;

  return <AuthView initialMode={initialMode} initialError={initialError} />;
}

