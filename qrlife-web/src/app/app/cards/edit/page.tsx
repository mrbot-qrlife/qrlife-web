import { Suspense } from 'react';
import { BottomNav } from '@/components/BottomNav';
import EditCardClient from './EditCardClient';

export default function Page() {
  return (
    <div className="min-h-dvh pb-28">
      <Suspense fallback={<div className="min-h-dvh px-5 py-8 max-w-xl mx-auto text-white/70">Loading…</div>}>
        <EditCardClient />
      </Suspense>
      <BottomNav />
    </div>
  );
}
