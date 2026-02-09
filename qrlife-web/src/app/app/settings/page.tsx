'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from "@/components/BottomNav";
import { supabaseBrowser } from '@/lib/supabase/client';

export default function Settings() {
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    supabaseBrowser().auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? '');
    });
  }, []);

  async function signOut() {
    await supabaseBrowser().auth.signOut();
    router.replace('/auth/login');
  }

  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/app/" className="text-white/70 hover:text-white">← Back</Link>
      </div>
      <h1 className="mt-4 text-2xl font-bold">Settings</h1>
      <div className="mt-6 qrlife-card rounded-2xl p-4 text-white/80 space-y-3">
        <div>
          <div className="text-white/60 text-sm">Signed in as</div>
          <div className="font-medium">{email || 'Loading…'}</div>
        </div>

        <button onClick={signOut} className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10">
          Sign out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
