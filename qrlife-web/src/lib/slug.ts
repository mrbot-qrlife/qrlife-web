export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function randomSuffix(len = 4) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// New cards should use a neutral short code slug (privacy-friendly).
export function makeSlugCode(len = 6) {
  return randomSuffix(len);
}

// Legacy helper (name-based) kept for future migration/redirect work.
export function makeNameSlug(name: string) {
  const base = slugify(name) || 'card';
  return `${base}-${randomSuffix(4)}`;
}
