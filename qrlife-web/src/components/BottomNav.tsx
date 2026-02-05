'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, QrCode, ScanLine, Settings } from 'lucide-react';
import clsx from 'clsx';

const items = [
  { href: '/app/', label: 'Home', icon: Home },
  { href: '/app/', label: 'QR Cards', icon: QrCode },
  { href: '/app/scans/', label: 'Scans', icon: ScanLine },
  { href: '/app/settings/', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const path = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="mx-auto max-w-xl px-4 pb-4">
        <div className="qrlife-card rounded-2xl px-4 py-3 flex items-center justify-between">
          {items.map((it) => {
            const active = path === it.href || (it.href !== '/app/' && path.startsWith(it.href));
            const Icon = it.icon;
            return (
              <Link
                key={it.label}
                href={it.href}
                className={clsx(
                  'flex flex-col items-center gap-1 text-xs px-2 py-1 rounded-xl',
                  active ? 'text-white' : 'text-white/60 hover:text-white/80'
                )}
              >
                <Icon size={18} className={active ? 'text-[color:var(--qrlife-teal)]' : ''} />
                {it.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
