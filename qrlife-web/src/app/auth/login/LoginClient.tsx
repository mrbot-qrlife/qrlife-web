'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const next = sp.get('next') || '/app/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg('');
    try {
      const sb = supabaseBrowser();
      if (mode === 'signin') {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(next);
      } else {
        const { error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        setMsg('Check your email for a confirmation link, then sign in.');
      }
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : 'Auth error');
    } finally {
      setBusy(false);
    }
  }

  async function signInGoogle() {
    setBusy(true);
    setMsg('');
    try {
      const sb = supabaseBrowser();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err: unknown) {
      setBusy(false);
      setMsg(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  }

  return (
    <div className="min-h-dvh px-5 py-8 max-w-md mx-auto">
      <Link href="/" className="text-white/70 hover:text-white">← QRLife</Link>
      <h1 className="mt-4 text-3xl font-bold">Sign in</h1>
      <p className="text-white/70 mt-1">Sync your QR Cards across devices.</p>

      <form onSubmit={onSubmit} className="mt-6 qrlife-card rounded-2xl p-4 space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email" className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Password" className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" />
        <button disabled={busy} className="w-full rounded-xl px-4 py-3 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold disabled:opacity-60">
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        <button type="button" disabled={busy} onClick={signInGoogle} className="w-full rounded-xl px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/10 disabled:opacity-60">
          Continue with Google
        </button>

        <div className="text-sm text-white/70 text-center pt-1">
          {mode === 'signin' ? (
            <button type="button" onClick={() => setMode('signup')} className="underline">Need an account? Sign up</button>
          ) : (
            <button type="button" onClick={() => setMode('signin')} className="underline">Already have an account? Sign in</button>
          )}
        </div>

        {msg && <div className="text-sm text-amber-300">{msg}</div>}
      </form>
    </div>
  );
}
