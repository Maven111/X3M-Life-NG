'use client';

import React from 'react';
import { Card, Button } from '@/components/ui';

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <Card variant="elevated" className="max-w-md w-full text-center space-y-4">
        <h2 className="text-xl font-bold font-heading text-foreground">Something went wrong</h2>
        <p className="text-sm text-surface-foreground/70 font-body">
          {error.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <Button onClick={() => reset()} className="w-full">
          Try Again
        </Button>
      </Card>
    </div>
  );
}

