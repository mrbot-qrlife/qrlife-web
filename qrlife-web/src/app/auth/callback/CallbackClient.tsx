'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') || '/app/';

  useEffect(() => {
    const sb = supabaseBrowser();
    const code = sp.get('code');

    async function run() {
      if (code) {
        await sb.auth.exchangeCodeForSession(code);
      }
      router.replace(next);
    }

    run();
  }, [next, router, sp]);

  return <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto text-white/70">Finishing sign in…</div>;
}
