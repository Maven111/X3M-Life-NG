'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleLogout} disabled={loading}>
      {loading ? 'Signing Out...' : 'Sign Out'}
    </Button>
  );
}

