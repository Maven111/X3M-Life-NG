import React from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <Card variant="elevated" className="max-w-md w-full text-center space-y-4">
        <h2 className="text-xl font-bold font-heading text-foreground">Page Not Found</h2>
        <p className="text-sm text-surface-foreground/70 font-body">
          The page you are looking for does not exist in X3M Life NG.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/register">
            <Button size="sm">Register</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="sm">Sign In</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

