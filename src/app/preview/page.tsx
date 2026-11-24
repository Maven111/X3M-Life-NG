'use client';

import dynamic from 'next/dynamic';

const GameClientView = dynamic(
  () => import('@/components/game/GameClientView').then((mod) => mod.GameClientView),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-brand-charcoal text-brand-white">
        <div className="w-12 h-12 border-4 border-outline/30 border-t-primary rounded-m3-full animate-spin" />
        <div className="mt-4 font-display font-bold text-base">
          Loading 3D Character Preview...
        </div>
      </div>
    )
  }
);

export default function CharacterPreviewPage() {
  return (
    <main className="w-screen h-screen overflow-hidden">
      <GameClientView />
    </main>
  );
}

