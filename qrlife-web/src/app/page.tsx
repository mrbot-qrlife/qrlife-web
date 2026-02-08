import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-dvh px-5 py-10 max-w-xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm text-white/80">
          QRLife Web • MVP
        </div>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight">QRLife</h1>
        <p className="mt-3 text-white/70">
          Dynamic QR cards you can update after printing — plus scan insights and safer link checks.
        </p>

        <div className="mt-7 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/app/"
            className="rounded-2xl px-5 py-3 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold"
          >
            Open the app
          </Link>
          <Link
            href="/c/local"
            className="rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white/90"
          >
            View local demo card
          </Link>
        </div>

        <div className="mt-10 qrlife-card rounded-3xl p-5 text-left">
          <div className="font-semibold">What works right now</div>
          <ul className="mt-2 space-y-1 text-white/75 text-sm list-disc pl-5">
            <li>Create QR cards (local-first) with links</li>
            <li>Public profile pages: <span className="text-white/90">/c/&lt;slug&gt;</span> (Supabase-backed)</li>
            <li>Scan page prototype (camera/upload)</li>
          </ul>

          <div className="mt-4 text-xs text-white/50">
            Next: full Supabase card editing + real QR destinations + scan tracking.
          </div>
        </div>
      </div>
    </div>
  );
}
