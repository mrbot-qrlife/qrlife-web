import Link from 'next/link';

export default function EditDemo1() {
  return (
    <div className="min-h-dvh px-5 py-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/app/" className="text-white/70 hover:text-white">← Back</Link>
        <Link href="/app/cards/demo-1/qr/" className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15">Download QR</Link>
      </div>

      <h1 className="mt-4 text-2xl font-bold">Edit QR Card</h1>
      <div className="text-white/60 text-sm">(Prototype) Card: demo-1</div>

      <div className="mt-5 qrlife-card rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-[color:var(--qrlife-purple)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center">MC</div>
            <div>
              <div className="font-semibold">My Information</div>
              <div className="text-xs text-white/70">QR Cards are dynamic QR codes you can update after printing.</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-80">Active</span>
            <div className="h-6 w-11 rounded-full bg-emerald-400/80 relative">
              <div className="h-5 w-5 rounded-full bg-white absolute right-0.5 top-0.5" />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" defaultValue="MrChris" placeholder="QR Card Name" />
          <input className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3" placeholder="Job Title (Optional)" />
          <textarea className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 min-h-28" placeholder="Bio (Optional)" />

          <div className="pt-2">
            <button className="w-full text-left rounded-xl bg-white/10 border border-white/10 px-4 py-3">
              Add Contact Info ▾
            </button>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Social Networks</div>
              <button className="rounded-xl bg-[color:var(--qrlife-purple)] px-4 py-2">Add New Link</button>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                <div>Facebook</div>
                <div className="text-white/60 truncate max-w-[55%]">https://facebook.com/MrChrisDoesStuff</div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2">
            <button className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/15">Cancel</button>
            <button className="rounded-xl px-4 py-2 bg-[color:var(--qrlife-teal)] text-slate-950 font-semibold">Save</button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xs text-white/60">
        Safety check status: <span className="text-amber-300">WARN mode</span> (Safe Browsing key not configured yet)
      </div>
    </div>
  );
}
