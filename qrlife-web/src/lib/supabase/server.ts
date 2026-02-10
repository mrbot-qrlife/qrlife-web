import { createClient } from '@supabase/supabase-js';

export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error('Missing env NEXT_PUBLIC_SUPABASE_URL');

  // Prefer service role when present; fall back to anon for environments
  // where runtime server env vars are not yet wired correctly.
  const key = serviceKey || anonKey;
  if (!key) throw new Error('Missing env SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY fallback)');

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
