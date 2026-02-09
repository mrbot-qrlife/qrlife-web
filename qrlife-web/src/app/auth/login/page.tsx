import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh px-5 py-8 max-w-md mx-auto text-white/70">Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
