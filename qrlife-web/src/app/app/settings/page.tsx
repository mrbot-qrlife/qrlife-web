import Link from 'next/link';
import { BottomNav } from "@/components/BottomNav";

export default function Settings() {
  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/app/" className="text-white/70 hover:text-white">← Back</Link>
      </div>
      <h1 className="mt-4 text-2xl font-bold">Settings</h1>
      <div className="mt-6 qrlife-card rounded-2xl p-4 text-white/70">Coming soon…</div>

      <BottomNav />
    </div>
  );
}
