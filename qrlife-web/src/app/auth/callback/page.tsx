import { Suspense } from 'react';
import CallbackClient from './CallbackClient';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh px-5 py-8 max-w-xl mx-auto text-white/70">Finishing sign in…</div>}>
      <CallbackClient />
    </Suspense>
  );
}
