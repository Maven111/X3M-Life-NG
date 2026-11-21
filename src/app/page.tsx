'use client';

import dynamic from 'next/dynamic';

/**
 * Main Game Viewport & HUD Shell
 * Dynamic import with SSR disabled guarantees WebGL & 3D Canvas
 * mount cleanly without server/client hydration mismatches.
 */
const GameClientView = dynamic(
  () => import('@/components/game/GameClientView').then((mod) => mod.GameClientView),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-surface text-surface-foreground">
        <div className="w-12 h-12 border-4 border-outline border-t-primary rounded-m3-full animate-spin" />
        <div className="mt-4 font-display font-bold text-base text-white">
          Initializing X3M Life Simulation...
        </div>
      </div>
    )
  }
);

export default function HomePage() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <GameClientView />
    </main>
  );
}

