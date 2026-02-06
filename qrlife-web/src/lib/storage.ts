export type SocialKind =
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'x'
  | 'linkedin'
  | 'website'
  | 'custom';

export type QrCard = {
  id: string;
  name: string;
  jobTitle?: string;
  bio?: string;
  active: boolean;
  scans: number;
  lastScannedAt?: string;
  createdAt: string;
  updatedAt: string;
  links: Array<{ kind: SocialKind; url: string; label?: string }>;
};

const KEY = 'qrlife.cards.v1';

function nowIso() {
  return new Date().toISOString();
}

export function makeId() {
  // local-only id (not the final public code)
  return Math.random().toString(36).slice(2, 10);
}

export function loadCards(): QrCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as QrCard[];
  } catch {
    return [];
  }
}

export function saveCards(cards: QrCard[]) {
  window.localStorage.setItem(KEY, JSON.stringify(cards));
}

export function upsertCard(input: Omit<QrCard, 'createdAt' | 'updatedAt' | 'scans'> & { createdAt?: string; scans?: number }): QrCard {
  const cards = loadCards();
  const i = cards.findIndex((c) => c.id === input.id);
  const existing = i >= 0 ? cards[i] : undefined;

  const card: QrCard = {
    id: input.id,
    name: input.name,
    jobTitle: input.jobTitle,
    bio: input.bio,
    active: input.active,
    scans: existing?.scans ?? input.scans ?? 0,
    lastScannedAt: existing?.lastScannedAt,
    createdAt: existing?.createdAt ?? input.createdAt ?? nowIso(),
    updatedAt: nowIso(),
    links: input.links ?? existing?.links ?? [],
  };

  if (i >= 0) cards[i] = card;
  else cards.unshift(card);

  saveCards(cards);
  return card;
}

export function getCard(id: string): QrCard | undefined {
  return loadCards().find((c) => c.id === id);
}

export function recordLocalScan(id: string) {
  const cards = loadCards();
  const i = cards.findIndex((c) => c.id === id);
  if (i < 0) return;

  const c = cards[i];
  const updated: QrCard = {
    ...c,
    scans: (c.scans ?? 0) + 1,
    lastScannedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  cards[i] = updated;
  saveCards(cards);
}
