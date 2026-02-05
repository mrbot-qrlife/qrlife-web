import { Suspense } from 'react';
import EditCardClient from './EditCardClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-dvh px-5 py-8 max-w-xl mx-auto text-white/70">Loading…</div>}>
      <EditCardClient />
    </Suspense>
  );
}
