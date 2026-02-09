'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const sb = supabaseBrowser();

    sb.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) {
        router.replace(`/auth/login?next=${encodeURIComponent(pathname || '/app/')}`);
        return;
      }
      setLoading(false);
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session) {
        router.replace(`/auth/login?next=${encodeURIComponent(pathname || '/app/')}`);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (loading) {
    return <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto text-white/70">Checking login…</div>;
  }

  return <>{children}</>;
}
